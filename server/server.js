const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const app = express();
const fs = require('fs');
const axios = require('axios');
const { response } = require('express');

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

app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get('/searchhotels', function(req, res){
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



app.get('/hotelsprices_givendest', function(req, res){

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

app.post('/booking', function(req, res){
    let myJson = req.body;
    console.log('received!');
    fs.readFile('bookings.json', 'utf8', function readFileCallback(err, data) {
        if (err){
            console.log(err);
        }
        else{
            let currentJSON = JSON.parse(data);
            currentJSON.push(myJson);
            fs.writeFile('bookings.json', JSON.stringify(currentJSON, null, 4), 'utf8', function(err){
                if(err) throw err;
                console.log("writing done.");
            });
    
    
        }
    });



    res.send(myJson);
});


app.get("/hotel/:hotelName", (req, res) => {
    let keyword = req.url.split('/').pop().split('%20').join(' ').split('+').join(' ');
    console.log(keyword)
    let result =[];
    for(let i=0; i<hotels_sg.length; i++){
        if(keyword === hotels_sg[i]["name"]){
            result.push(hotels_sg[i]["latitude"])
            result.push(hotels_sg[i]["longitude"])
            result.push(hotels_sg[i]["address"])
            result.push(hotels_sg[i]["rating"])
            result.push(hotels_sg[i]["description"])
            result.push(hotels_sg[i]["amenities"])
        }
    }
    if(result.length===0){
        for(let i=0; i<hotels_my.length; i++){
            if(keyword === hotels_my[i]["name"]){
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
})


server.listen(5000, () => {
    console.log(`Listening at http://localhost:5000`)
})
// app.listen(5000, () => {
//     console.log("Server started on port 5000");
// });