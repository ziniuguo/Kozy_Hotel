// testing for search
let q = "";
let page = ['1', '2', '3', '4', '5'];
let loc = "Singapore%2C+Singapore";
let locID = "RsBU";
let checkin = formatDate(new Date());
let checkout = formatDate(new Date((new Date()).valueOf() + 1000 * 3600 * 24));
let guests = '2'

function getRandomItem(arr) {
    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);
    // get random item
    return arr[randomIndex];
}

describe('spec.cy.js', () => {
    it('passes', () => {
        cy.visit(
            "localhost:3000/"
            + "search?q=" +
            q +
            "&page=" +
            getRandomItem(page) +
            "&loc=" +
            loc +
            "&locID=" +
            locID +
            "&checkin=" +
            checkin +
            "&checkout=" +
            checkout +
            "&guests=" +
            guests
        );
        cy.log("hello")
        cy.get('#locForm').within(() => {
            // cy.get('input[name=q]').type("question")
        })
    })
})

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-');
}
