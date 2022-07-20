const http = require('http');
const express = require('express');
const axios = require('axios');
const WebSocket = require('ws');
const app = express();
const cors = require('cors');
const fs = require('fs');
const e = require("express");
const RsBU = JSON.parse(fs.readFileSync('destination_RsBU.json'))
const WDOM = JSON.parse(fs.readFileSync('destination_WD0M.json'))
const EzoR = JSON.parse(fs.readFileSync('destination_EzoR.json'))
const hotels_sg = JSON.parse(fs.readFileSync('hotels_sg.json'))
const hotels_my = JSON.parse(fs.readFileSync('hotels_my.json'))
const destination = JSON.parse(fs.readFileSync('destinations.json'));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/booking', function (req, res) {
    let myJson = req.body;
    console.log('received!');
    fs.readFile('bookings.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            fs.writeFile('bookings.json', JSON.stringify(myJson, null, 4), 'utf8', function (err) {
                if (err) throw err;
                console.log("writing done.");
            });


        }
    });


    res.send(myJson);
});


app.get("/hotel/:hotelName", (req, res) => {
    let keyword = req.url.split('/').pop().split('%20').join(' ').split('+').join(' ');
    console.log(keyword)
    let result = [];
    for (let i = 0; i < hotels_sg.length; i++) {
        if (keyword === hotels_sg[i]["name"]) {
            result.push(hotels_sg[i]["latitude"])
            result.push(hotels_sg[i]["longitude"])
            result.push(hotels_sg[i]["address"])
            result.push(hotels_sg[i]["rating"])
            result.push(hotels_sg[i]["description"])
            result.push(hotels_sg[i]["amenities"])
        }
    }
    if (result.length === 0) {
        for (let i = 0; i < hotels_my.length; i++) {
            if (keyword === hotels_my[i]["name"]) {
                result.push(hotels_my[i]["latitude"])
                result.push(hotels_my[i]["longitude"])
                result.push(hotels_my[i]["address"])
                result.push(hotels_my[i]["rating"])
                result.push(hotels_my[i]["description"])
                result.push(hotels_my[i]["amenities"])
            }
        }
    }
    console.log(result)
    res.json(result)
})

app.get("/search", async (req, res) => {
    if (req.query.hasOwnProperty('q') && req.query.hasOwnProperty('page') && req.query.hasOwnProperty("locID")) {
        let pageNo;
        let itemPerPage = 5;
        let result = [];
        let apiResult;
        const keyword = req.query.q;
        const getOptions = {
            url: 'https://hotelapi.loyalty.dev/api/hotels?' + new URLSearchParams({
                destination_id: req.query.locID,
            }),
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }
        await axios(getOptions)
            .then(response => {
                apiResult = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
        result = apiResult.map(e => [e["id"], e["name"], e["rating"], e["address"], e["cloudflare_image_url"] + "/" + e["id"] + "/i" + e["default_image_index"] + ".jpg"])
        pageNo = Math.ceil(Object.keys(result).length / itemPerPage);
        if (pageNo === 0) {
            res.json(["no match", 1]);
        } else {
            const reqPage = parseInt(req.query.page);
            if (reqPage <= pageNo && reqPage >= 1) {
                let currPage = Object.entries(result)
                    .slice((reqPage - 1) * itemPerPage, itemPerPage * reqPage)
                    .map(entry => entry[1]); // 如果不加这行 前面会自动加个参数 因为他好像是要json object, idk why
                currPage.push(pageNo);
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
})


server.listen(5000, () => {
    console.log(`Listening at http://localhost:5000`)
})
// app.listen(5000, () => {
//     console.log("Server started on port 5000");
// });