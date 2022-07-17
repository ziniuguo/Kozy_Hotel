const fs = require('fs');
const destination = JSON.parse(fs.readFileSync('destinations.json'));

console.log(destination.length)
console.log(destination[destination.length - 1]["term"])
console.log(typeof destination[0]["term"])

let searchResult= [];
for (let i = 0; i < destination.length; i++) {
    if ((typeof destination[i]["term"]!=='undefined') && !checkList(destination[i]["term"])) {
        searchResult.push(destination[i])
    }
}

function checkList(item) {
    for (let i = 0; i < searchResult.length; i++) {
        if ((searchResult[i]["term"]).toUpperCase().includes(item.toUpperCase())) {
            return true;
        }
    }
    return false;
}

console.log(searchResult)