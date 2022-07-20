const axios = require('axios');

let tryURL = 'https://hotelapi.loyalty.dev/api/hotels?' + new URLSearchParams({
    destination_id: "RsBU",

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

    })
    .catch((error) => {
        console.log(error);
    });