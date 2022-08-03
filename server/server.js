import http from "http";
import express from "express";
import axios from "axios";
import {WebSocketServer} from "ws";
import fs from "fs";
import auth from "./auth.js";
import booking from "./makeBooking.js";


const app = express();
const destination = JSON.parse(fs.readFileSync('destinations.json'));


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(auth); // auth is router
app.use(booking); //booking is also a router

// handle hotel detail page GET request
app.get("/hotel/:hotelName", async function (req, res) {
    let queryURL = 'https://hotelapi.loyalty.dev/api/hotels/' + req.url.split('/').pop();
    let apiResult;
    let result = [];
    console.log(queryURL)
    const getOptions = {
        url: queryURL,
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
    result.push(apiResult["name"])
    result.push(apiResult["latitude"])
    result.push(apiResult["longitude"])
    result.push(apiResult["address"])
    result.push(apiResult["rating"])
    result.push(apiResult["description"])
    result.push(apiResult["cloudflare_image_url"] + "/" + apiResult["id"] + "/i")
    result.push(apiResult["number_of_images"])
    console.log(result)
    res.json(result)
})

// handle search GET request. Search params are in URL
app.get("/search", async (req, res) => {
    // q is not currently implemented
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
                guests: req.query.guests.replaceAll('%7C', '|'),
                partner_id: 1,
            }),
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        }
        while (!searchComplete && searchTime <= 3) {
            console.log("=== searching ===")
            console.log("searchTime: " + searchTime)
            await axios(getOptions)
                .then(response => {
                    apiResult = response.data;
                })
                .catch(() => {
                    console.log("error @ getting hotel ID by filters");
                });
            if (typeof apiResult === 'undefined' || apiResult["hotels"].length === 0) {
                console.log("empty hotel list...")
                searchTime += 1;
            } else {
                console.log("got hotel list! length: " + apiResult["hotels"].length)
                searchComplete = true;
                // searchTime += 1;
            }
        }
        if (searchComplete) {
            result = apiResult["hotels"];
        } else {
            result = [];
        }

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

                //这里逻辑比较怪 大概是
                // 一个页面有5个item(或者更少)
                // 然后对于其中的每一个我都try 4次(每次try的时候判断当前的结果的长度是不是0)
                // 一共5*4=20次
                // 如果最后结果长度不是页面的item总数(5) 就给用户error
                // 但其实吧 只要对于任意一个item 4次不出结果就已经error了
                // 因为就算其他都出了长度也不够了
                // 不过懒得改了凑合用吧
                for (let i = 0;
                     i < currPageRawData.length;
                     // not itemPerPage! sometimes one page not 5 items!
                     i++) {
                    let currID = currPageRawData[i][0];
                    let currResult = [];
                    let opt = {
                        url: "https://hotelapi.loyalty.dev/api/hotels/" + currID,
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'},
                    }
                    let loadComplete = false;
                    let loadTime = 0;
                    // 对于其中的每一个我都try 4次
                    while (!loadComplete && loadTime <= 3) {
                        console.log("=== loading ===")
                        console.log("loadTime: " + loadTime)
                        await axios(opt)
                            .then(response => {
                                currResult.push(currID);
                                currResult.push(response.data["name"])
                                currResult.push([currPageRawData[i][1]]) // price
                                currResult.push(response.data["address"])
                                currResult.push(response.data["cloudflare_image_url"] + "/" + response.data["id"] + "/i" + response.data["default_image_index"] + ".jpg")
                                currResult.push(response.data["rating"])
                                resResult.push(currResult)
                            })
                            .catch(() => {
                                console.log("error @ getting hotel detail by ID");
                            });
                        // (每次try的时候判断当前的结果的长度是不是0)
                        if (currResult.length === 0) {
                            console.log("wrong")
                            loadTime += 1;
                        } else {
                            console.log("get detail by id success! length: " + resResult.length)
                            loadComplete = true;
                        }
                    }
                }
                if (resResult.length ===
                    currPageRawData.length
                    // similarly, not itemPerPage!
                ) {
                    resResult.push(pageNo);
                    res.json(resResult);
                } else {
                    console.log("error_loading_detail_by_ID");
                    res.json(["error_loading_detail_by_ID", 1]);
                }


            } else {
                res.json(["page_exceeded", 1]);
            }
        }
    } else {
        res.json(["undefined_query_params", 1]);
    }
})

const server = http.createServer(app);
const wss = new WebSocketServer({server})


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