const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const app = express();
const fs = require('fs');
const destination = JSON.parse(fs.readFileSync('destinations.json'));


const realJSON = {
    "hotel one": {
        "hotel_id": "1004890",
        "location": "Singapore"
    },
    "hotel two": {
        "hotel_id": "1005604",
        "location": "Singapore"
    },
    "hotel three": {
        "hotel_id": "1004891",
        "location": "Malaysia"
    },
    "hotel four": {
        "hotel_id": "1004894",
        "location": "Thailand"
    },
    "hotel five": {
        "hotel_id": "1004895",
        "location": "Malaysia"
    },
    "hotel six": {
        "hotel_id": "1004896",
        "location": "Thailand"
    },
    "hotel seven": {
        "hotel_id": "1004897",
        "location": "Thailand"
    },
    "SUTD Hostel": {
        "hotel_id": "1008888",
        "location": "Singapore"
    }
}

// let bookedJSON = {
//     bookedRoom: {
//         "1004890": {
//             name: "CatRoll",
//             phone: "81770190",
//             email: "guo.ziniu.1003@gmail.com"
//         },
//     }
// }


app.get("/search", (req, res) => {

    if (req.query.hasOwnProperty('q') && req.query.hasOwnProperty('page') && req.query.hasOwnProperty("loc")) {
        let pageNo;
        let itemPerPage = 3;
        let result = {};
        const keyword = req.query.q;
        for (const room of Object.entries(realJSON)) {
            if (room[0].toUpperCase().includes(keyword.toUpperCase())
                && ((req.query.loc === 'any') ? true : (req.query.loc === room[1].location))) {
                result[room[0]] = room[1];
            }
        }

        pageNo = Math.ceil(Object.keys(result).length / itemPerPage);
        if (pageNo === 0) {
            res.json(["no match", 1]);
        } else {
            const reqPage = parseInt(req.query.page);
            if (reqPage <= pageNo && reqPage >= 1) {
                let currPage = Object.entries(result).slice((reqPage - 1) * itemPerPage, itemPerPage * reqPage).map(entry => entry[0]);
                currPage.push(pageNo)
                res.json(currPage);
            } else {
                res.json(["page_exceeded", 1]);
            }
        }
    } else {
        res.json(["undefined_query_params", 1]);
    }
})

const server = http.createServer(app);
const wss = new WebSocket.Server({server})


wss.on('connection', ws => {

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
        let searchResult = [];
        for (let i = 0; i < destination.length; i++) {
            if ((typeof destination[i]["term"]==='undefined' ? "" : destination[i]["term"]).toUpperCase().includes(message.toString().toUpperCase())) {
                searchResult.push(destination[i]["term"])
                ws.send(JSON.stringify(searchResult));
            }
        }
    })

    // ws.on('close', function close() {
    //     clearInterval(interval);
    // });
})


server.listen(5000, () => {
    console.log(`Listening at http://localhost:5000`)
})
// app.listen(5000, () => {
//     console.log("Server started on port 5000");
// });