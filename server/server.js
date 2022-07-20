const http = require('http');
const express = require('express');
const axios = require('axios');
const WebSocket = require('ws');
const app = express();
const fs = require('fs');
const {satisfies} = require("nodemon/lib/utils");


const hotels_sg = JSON.parse(fs.readFileSync('hotels_sg.json'))
const hotels_my = JSON.parse(fs.readFileSync('hotels_my.json'))
const destination = JSON.parse(fs.readFileSync('destinations.json'));


app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get('/searchhotels', function (req, res) {
    /*
    These are hardcoded for now, just to show the API works. Do use these things to figure out how to link to your side of 
    the project. Add more app.get() for different parts of the API perhaps. This one is '/searchhotels' for hotels given a destination id.

    You can see the output results of the queries below by submitting a booking form first, then opening console to see the output.
    Imma continue working tomorrow because it's 3am.
*/

    //This is for searching hotels given a destination id. Hardcoded to have id WD0M.
    // let tryURL = 'https://hotelapi.loyalty.dev/api/hotels?destination_id=WD0M';


    // to be implemented
})


app.get('/hotelsprices_givendest', function (req, res) {

    //This is for searching for hotel prices given the parameters below. Also hardcoded for now.
    let tryURL = 'https://hotelapi.loyalty.dev/api/hotels/prices?' + new URLSearchParams({
        destination_id: "WD0M",
        checkin: "2022-07-20",
        checkout: "2022-07-22",
        lang: "en_US",
        currency: "SGD",
        country_code: "SG",
        guests: 2,
        partner_id: 1
    })

    console.log(tryURL);

    const getOptions = {
        url: tryURL,
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    }

    axios(getOptions)
        .then(response => {
            console.log("It's done!");
            console.log(JSON.stringify(response.data));
            res.status(200).json({
                data: JSON.parse(JSON.stringify(response.data))
            })
        })
        .catch((error) => {
            console.log(error);
        });

    // console.log("GET done!")
    // const jsonData = response.json();
    // console.log(jsonData);
    // res.send(jsonData);


})


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
    if (req.query.hasOwnProperty('q') &&
        req.query.hasOwnProperty('page') &&
        req.query.hasOwnProperty("loc") &&
        req.query.hasOwnProperty('locID') &&
        req.query.hasOwnProperty('checkin') &&
        req.query.hasOwnProperty('checkout') &&
        req.query.hasOwnProperty('guests')) {
        let pageNo;
        let itemPerPage = 5;
        let result;
        let apiResult;
        let searchComplete = false;
        let searchTime = 0;

        // 先通过api选出来所有符合filter要求的hotel，（地点时间人数）
        const getOptions = {
            url: 'https://hotelapi.loyalty.dev/api/hotels/prices?' + new URLSearchParams({
                destination_id: req.query.locID,
                checkin: req.query.checkin,
                checkout: req.query.checkout,
                lang: "en_US",
                currency: "SGD",
                country_code: "SG",
                guests: req.query.guests,
                partner_id: 1,
            }),
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }
        while (!searchComplete && searchTime <= 6) {
            console.log("=== searching ===")
            console.log(searchTime + " times")
            await axios(getOptions)
                .then(response => {
                    apiResult = response.data;
                })
                .catch((error) => {
                    console.log("error @ getting hotel ID by filters");
                    searchComplete = true;
                });
            if (apiResult["hotels"].length !== 0) {
                console.log("got hotel list! length: " + apiResult["hotels"].length)
                searchComplete = true;
            } else {
                console.log("empty hotel list...")
                searchTime += 1;
            }
        }
        result = apiResult["hotels"]
        pageNo = Math.ceil(Object.keys(result).length / itemPerPage);
        if (pageNo === 0) {
            console.log("no match")
            res.json(["no match", 1]);
        } else {
            const reqPage = parseInt(req.query.page);
            if (reqPage <= pageNo && reqPage >= 1) {
                let currPageRawData = Object.entries(result)
                    .slice((reqPage - 1) * itemPerPage, itemPerPage * reqPage)
                    .map(entry => entry[1]); // 如果不加这行 前面会自动加个参数 因为他好像是要json object, idk why
                // 前面只记录id不处理，在这再处理数据
                currPageRawData = currPageRawData.map(e => [e["id"], e["lowest_price"] + " - " + e["price"]])
                let resResult = []
                for (let i = 0; i < currPageRawData.length; i++) {
                    let currID = currPageRawData[i][0];
                    let opt = {
                        url: "https://hotelapi.loyalty.dev/api/hotels/" + currID,
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'},
                    }
                    await axios(opt)
                        .then(response => {
                            let currResult = [];
                            currResult.push(currID);
                            currResult.push(response.data["name"])
                            currResult.push([currPageRawData[i][1]]) // price
                            currResult.push(response.data["address"])
                            currResult.push(response.data["cloudflare_image_url"] + "/" + response.data["id"] + "/i" + response.data["default_image_index"] + ".jpg")
                            currResult.push(response.data["rating"])
                            resResult.push(currResult)
                        })
                        .catch((error) => {
                            console.log("error @ getting hotel detail by ID");
                        });
                }
                resResult.push(pageNo);
                // console.log(resResult)
                res.json(resResult);
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