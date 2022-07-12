const express = require('express')
const app = express()

// need to add session management. 
const myJSON = {"hotels": ["hotel one", "hotel two", "hotel two2"]};

function search() {

}

app.get("/api", (req, res) => {
    res.json(myJSON);
})


app.get("/searchapi", (req, res) => {
    // sample response. Someone do the search function here
    const test = req.query;
    console.log(req.query);
    console.log(req.query.q);
    if (typeof req.query.q !== 'undefined') {
        let result = {"hotels": []};
        let keyword = req.query.q;
        for (let i = 0; i < myJSON.hotels.length; i++) {
            console.log(myJSON.hotels[i])
            if (myJSON.hotels[i].toUpperCase().includes(keyword.toUpperCase())) {
                result.hotels.push(myJSON.hotels[i]);
                console.log(myJSON.hotels[i] + " added");
            }
        }
        console.log(result);
        res.json(result);
    } else {
        res.json("undefined query params");
    }
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})