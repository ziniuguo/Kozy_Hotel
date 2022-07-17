const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const app = express();
const fs = require('fs');
const RsBU = JSON.parse(fs.readFileSync('destination_RsBU.json'))
const WDOM = JSON.parse(fs.readFileSync('destination_WD0M.json'))
const EzoR = JSON.parse(fs.readFileSync('destination_EzoR.json'))
const hotels_sg = JSON.parse(fs.readFileSync('hotels_sg.json'))
const hotels_my = JSON.parse(fs.readFileSync('hotels_my.json'))
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

    if (req.query.hasOwnProperty('q') && req.query.hasOwnProperty('page') && req.query.hasOwnProperty("locID")) {
        let pageNo;
        let itemPerPage = 10;
        let result = [];
        const keyword = req.query.q;
        let idList = [];
        if (req.query.locID === "RsBU") { // Singapore
            for (let i = 0; i < RsBU["hotels"].length; i++) {
                idList.push(RsBU["hotels"][i]["id"]);
            }
            for (let i = 0; i < hotels_sg.length; i++) {
                if (idList.includes(hotels_sg[i]["id"])
                    && hotels_sg[i]["name"].toUpperCase().includes(keyword.toUpperCase())) {
                    result[[hotels_sg[i]["name"]]] = hotels_sg[i]["id"];
                }
            }
        } else if (req.query.locID === "WD0M") { // C airport
            for (let i = 0; i < WDOM["hotels"].length; i++) {
                idList.push(WDOM["hotels"][i]["id"]);
            }
            for (let i = 0; i < hotels_sg.length; i++) {
                if (idList.includes(hotels_sg[i]["id"])
                    && hotels_sg[i]["name"].toUpperCase().includes(keyword.toUpperCase())) {
                    result[[hotels_sg[i]["name"]]] = hotels_sg[i]["id"];
                }
            }
        } else if (req.query.locID === "EzoR") { // my
            for (let i = 0; i < EzoR["hotels"].length; i++) {
                idList.push(EzoR["hotels"][i]["id"]);
            }
            for (let i = 0; i < hotels_my.length; i++) {
                if (idList.includes(hotels_my[i]["id"])
                    && hotels_my[i]["name"].toUpperCase().includes(keyword.toUpperCase())) {
                    result[[hotels_my[i]["name"]]] = hotels_my[i]["id"];
                }
            }
        } else { // no match

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
            if ((typeof destination[i]["term"] === 'undefined' ? "" : destination[i]["term"]).toUpperCase().includes(message.toString().toUpperCase())) {
                if (!searchResult.some(el => el.label === destination[i]["term"])) {
                    // searchResult.push(destination[i]["term"])
                    searchResult.push({"label": destination[i]["term"], "id": destination[i]["uid"]})
                }
            }
        }

        ws.send(JSON.stringify(searchResult));
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