const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.get("/searchapi", (req, res) => {
    // sample response
    res.json(req.query)
})

app.listen(5000, () => {console.log("Server started on port 5000")})