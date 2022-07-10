const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({"hotels": ["hotel 1", "hotel 2", "hotel 3"]})
})

app.get("/searchapi", (req, res) => {
    // sample response. Someone do the search function here
    res.json(req.query)
})

app.listen(5000, () => {console.log("Server started on port 5000")})