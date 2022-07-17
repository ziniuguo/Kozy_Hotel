const fs = require('fs');
const destination = JSON.parse(fs.readFileSync('destinations.json'));

console.log(destination.length)
console.log(destination[destination.length - 1]["term"])
console.log(typeof destination[0]["term"])

let searchResult= [];
const message = "Guan"
for (let i = 0; i < destination.length; i++) {
    if ((typeof destination[i]["term"]==='undefined' ? "" : destination[i]["term"]).toUpperCase().includes(message.toUpperCase())) {
        searchResult.push(destination[i]["term"])
        console.log(JSON.stringify(searchResult));
    }
}