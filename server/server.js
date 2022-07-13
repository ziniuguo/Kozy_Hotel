const express = require('express')
const app = express()


const realJSON = {
    "room one": {
        "room_id": "1004890",
        "price": 100,
        "type": "single"
    },
    "room two": {
        "room_id": "1005604",
        "price": 50,
        "type": "single"
    },
    "room three": {
        "room_id": "1004891",
        "price": 1,
        "type": "double"
    },
    "room four": {
        "room_id": "1004894",
        "price": 1,
        "type": "double"
    },
    "room five": {
        "room_id": "1004895",
        "price": 1,
        "type": "double"
    },
    "room six": {
        "room_id": "1004896",
        "price": 100,
        "type": "single"
    },
    "room seven": {
        "room_id": "1004897",
        "price": 120,
        "type": "double"
    }
}

let bookedJSON = {
    bookedRoom: {
        "1004890": {
            name: "CatRoll",
            phone: "81770190",
            email: "guo.ziniu.1003@gmail.com"
        },
    }
}



app.get("/searchapi", (req, res) => {

    if (req.query.hasOwnProperty('q') && req.query.hasOwnProperty('page')) {
        let pageNo;
        let itemPerPage = 3;
        let result = {};
        const keyword = req.query.q;
        for (const room of Object.entries(realJSON)) {
            console.log(room[0]);
            console.log(keyword);
            if (room[0].toUpperCase().includes(keyword.toUpperCase())) {
                result[room[0]] = room[1];
            }
        }
        console.log(keyword);
        console.log(result);
        pageNo = Math.ceil(Object.keys(result).length / itemPerPage);
        if (pageNo === 0) {
            res.json(["no match", 1]);
        } else {
            const reqPage = parseInt(req.query.page);
            if (reqPage <= pageNo && reqPage >= 1) {
                let currPage = Object.entries(result).slice((reqPage - 1) * itemPerPage, itemPerPage * reqPage).map(entry => entry[0]);
                currPage.push(pageNo)
                console.log(currPage)
                res.json(currPage);
            } else {
                res.json(["page_exceeded", 1]);
            }
        }
    } else {
        res.json(["undefined_query_params", 1]);
    }
})

app.listen(5000, () => {
    console.log("Server started on port 5000");
});