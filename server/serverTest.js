const axios = require('axios');

const getOptions = {
    url: 'https://hotelapi.loyalty.dev/api/hotels/prices?' + new URLSearchParams({
        destination_id: "WD0M",
        checkin: "2022-07-20",
        checkout: "2022-07-22",
        lang: "en_US",
        currency: "SGD",
        country_code: "SG",
        guests: 2,
        partner_id: 1
    }),
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
}



axios(getOptions)
    .then(response => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    });