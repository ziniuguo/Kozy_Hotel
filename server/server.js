const http = require('http');
const express = require('express');
const axios = require('axios');
const WebSocket = require('ws');
const app = express();
const fs = require('fs');

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
        checkin: "2022-07-22",
        checkout: "2022-07-25",
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
        const jsonData = JSON.stringify(response.data);    
        console.log(jsonData);
        res.send(jsonData);

    })
    .catch((error) => {
        console.log(error);
    });




})


app.post('/booking', function (req, res) {
    let myJson = req.body;
    console.log('received!');
    fs.readFile('bookings.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);

        } else {
            let currentJSON = JSON.parse(data);
            currentJSON.push(myJson);
            fs.writeFile('bookings.json', JSON.stringify(currentJSON, null, 4), 'utf8', function (err) {
                if (err) throw err;

                console.log("writing done.");
            });


        }
    });


    res.send(myJson);
});


// app.get("/hotel/:hotelName", (req, res) => {
//     let keyword = req.url.split('/').pop().split('%20').join(' ').split('+').join(' ');
//     console.log(keyword)
//     let result = [];
//     for (let i = 0; i < hotels_sg.length; i++) {
//         if (keyword === hotels_sg[i]["name"]) {
//             result.push(hotels_sg[i]["latitude"])
//             result.push(hotels_sg[i]["longitude"])
//             result.push(hotels_sg[i]["address"])
//             result.push(hotels_sg[i]["rating"])
//             result.push(hotels_sg[i]["description"])
//             result.push(hotels_sg[i]["amenities"])
//         }
//     }
//     if (result.length === 0) {
//         for (let i = 0; i < hotels_my.length; i++) {
//             if (keyword === hotels_my[i]["name"]) {
//                 result.push(hotels_my[i]["latitude"])
//                 result.push(hotels_my[i]["longitude"])
//                 result.push(hotels_my[i]["address"])
//                 result.push(hotels_my[i]["rating"])
//                 result.push(hotels_my[i]["description"])
//                 result.push(hotels_my[i]["amenities"])
//             }
//         }
//     }
//     console.log(result)
//     res.json(result)
// })

app.get("/hotel/:hotelName", async function (req, res) {
    let tryURL = 'https://hotelapi.loyalty.dev/api/hotels/' + req.url.split('/').pop();
    let apiResult;
    let result = [];
    console.log(tryURL)
    const getOptions = {
        url: tryURL,
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
        while (!searchComplete && searchTime <= 3) {
            console.log("=== searching ===")
            console.log("searchTime: " + searchTime)
            await axios(getOptions)
                .then(response => {
                    apiResult = response.data;
                })
                .catch((error) => {
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
                            .catch((error) => {
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