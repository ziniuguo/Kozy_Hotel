const fs = require('fs');
const hotel = JSON.parse(fs.readFileSync('destination_WD0M.json'))

console.log(hotel)