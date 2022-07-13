const express = require('express')
const app = express()

// need to add session management?
const myJSON = {
    hotels: [
        'hotel one', 'hotel two', 'hotel three', 'hotel four',
        'hotel 1', 'hotel 2', 'hotel 3',
        'hotel 4', 'hotel 5', 'hotel 6',
        'hotel 7', 'hotel 8', 'hotel 9',
        'hotel 10', 'hotel 11', 'hotel 12',
        'hotel 13', 'hotel 14', 'hotel 15',
        'hotel 16', 'hotel 17', 'hotel 18',
        'hotel 19', 'hotel 20', 'hotel 21',
        'hotel 22', 'hotel 23', 'hotel 24',
        'hotel 25', 'hotel 26', 'hotel 27',
        'hotel 28', 'hotel 29'
    ]
};



app.get("/api", (req, res) => {
    res.json(myJSON);
})


app.get("/searchapi", (req, res) => {
    // next to implement: page number

    if (req.query.hasOwnProperty('q') && req.query.hasOwnProperty('page')) {
        let pageNo;
        let itemPerPage = 3;
        let result = [];
        let keyword = req.query.q;
        for (let i = 0; i < myJSON.hotels.length; i++) {
            if (myJSON.hotels[i].toUpperCase().includes(keyword.toUpperCase())) {
                result.push(myJSON.hotels[i]);
            }
        }
        pageNo = Math.ceil(result.length / itemPerPage);
        if (req.query.q === "") {
            res.json(["empty", 1]);

        }else if (pageNo===0) {
            res.json(["no match", 1]);
        } else {
            const reqPage = parseInt(req.query.page);
            if (reqPage <= pageNo && reqPage >= 1) {
                let currPage = result.slice((reqPage - 1) * itemPerPage,
                    itemPerPage * reqPage);
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
})