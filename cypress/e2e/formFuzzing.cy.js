const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&*\\\"'";
const charsLength = characters.length;

function genRandString(strSize){
    let randStr = "";

    for(let i = 0; i < strSize; i++){
        randStr += characters[Math.floor(Math.random()*charsLength)];
    }

    return randStr;
}



describe('fuzzing booking form inputs', () => {
  it('performs fuzzing on form', () => {
    cy.visit('http://localhost:3000/booking/WaXd')

    cy.wait(1000)

    cy.get('#firstname').type(genRandString(10))

    cy.get('#lastname').type(genRandString(10))

    cy.get('#phonenum').type(genRandString(10))

    cy.get('#email').type(genRandString(10))

    cy.get('#creditcardNo').type(genRandString(10))

    cy.get('#cardexpiry').type(genRandString(10))

    cy.get('#cvvcvc').type(genRandString(10))

    cy.get('#billing').type(genRandString(10))

    cy.wait(500)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("contain", "Invalid phone number!")
    .and("contain", "Invalid email address!")
    .and("contain", "Invalid credit card number!")
    .and("contain", "Invalid expiry date!")
    .and("contain", "Invalid CVV/CVC!")

    cy.wait(500)

    cy.get('#firstname').clear().type(genRandString(100))

    cy.get('#lastname').clear().type(genRandString(100))

    cy.get('#phonenum').clear().type(genRandString(100))

    cy.get('#email').clear().type(genRandString(100))

    cy.get('#creditcardNo').clear().type(genRandString(100))

    cy.get('#cardexpiry').clear().type(genRandString(100))

    cy.get('#cvvcvc').clear().type(genRandString(100))

    cy.get('#billing').clear().type(genRandString(100))

    cy.wait(500)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("contain", "Invalid phone number!")
    .and("contain", "Invalid email address!")
    .and("contain", "Invalid credit card number!")
    .and("contain", "Invalid expiry date!")
    .and("contain", "Invalid CVV/CVC!")

    


  })
})