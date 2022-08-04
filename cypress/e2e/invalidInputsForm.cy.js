describe('Invalid inputs in form', () => {
  it('tests each field with various invalid inputs', () => {
    cy.visit('http://localhost:3000/booking/WaXd')

    cy.wait(1000)

    cy.get('#firstname').type("Ryan")

    cy.get('#lastname').type("Lee")

    cy.get('#phonenum').type("gggggggg")

    cy.get('#email').type("haha")

    cy.get('#creditcardNo').type("dfdfdfdf")

    cy.get('#cardexpiry').type("fakedate")

    cy.get('#cvvcvc').type("ggg")

    cy.get('#billing').type("55 SendHelp Road")

    cy.wait(500)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("contain", "Invalid phone number!")
    .and("contain", "Invalid email address!")
    .and("contain", "Invalid credit card number!")
    .and("contain", "Invalid expiry date!")
    .and("contain", "Invalid CVV/CVC!")

    cy.wait(500)

    cy.get('#phonenum').clear().type("88885555d")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid phone number!")

    cy.wait(400)

    cy.get('#phonenum').clear().type("88885555")

    cy.wait(400)

    cy.get('#bookingForm').should("not.contain", "Invalid phone number!")

    cy.wait(500)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("not.contain", "Invalid phone number!")
    .and("contain", "Invalid email address!")
    .and("contain", "Invalid credit card number!")
    .and("contain", "Invalid expiry date!")
    .and("contain", "Invalid CVV/CVC!")

    cy.wait(500)



    cy.get('#email').clear().type("haha.com")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid email address!")

    cy.wait(400)

    cy.get('#email').clear().type("haha@gmail.com")

    cy.wait(400)

    cy.get('#bookingForm').should("not.contain", "Invalid email address!")

    cy.wait(500)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("not.contain", "Invalid phone number!")
    .and("not.contain", "Invalid email address!")
    .and("contain", "Invalid credit card number!")
    .and("contain", "Invalid expiry date!")
    .and("contain", "Invalid CVV/CVC!")

    cy.wait(500)



    cy.get('#creditcardNo').clear().type("5588")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid credit card number!")

    cy.wait(400)

    cy.get('#creditcardNo').clear().type("555577778888999912345")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid credit card number!")

    cy.wait(400)

    cy.get('#creditcardNo').clear().type("5555777788889999")

    cy.wait(400)

    cy.get('#bookingForm').should("not.contain", "Invalid credit card number!")

    cy.wait(500)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("not.contain", "Invalid phone number!")
    .and("not.contain", "Invalid email address!")
    .and("not.contain", "Invalid credit card number!")
    .and("contain", "Invalid expiry date!")
    .and("contain", "Invalid CVV/CVC!")

    cy.wait(500)



    cy.get('#cardexpiry').clear().type("05 2055")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid expiry date!")

    cy.wait(400)

    cy.get('#cardexpiry').clear().type("05/55")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid expiry date!")

    cy.wait(400)

    cy.get('#cardexpiry').clear().type("20/2055")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid expiry date!")

    cy.wait(400)

    cy.get('#cardexpiry').clear().type("05/2055")

    cy.wait(400)

    cy.get('#bookingForm').should("not.contain", "Invalid expiry date!")
    
    cy.wait(500)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("not.contain", "Invalid phone number!")
    .and("not.contain", "Invalid email address!")
    .and("not.contain", "Invalid credit card number!")
    .and("not.contain", "Invalid expiry date!")
    .and("contain", "Invalid CVV/CVC!")

    cy.wait(500)



    cy.get('#cvvcvc').clear().type("5")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid CVV/CVC!")

    cy.wait(400)

    cy.get('#cvvcvc').clear().type("555555")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid CVV/CVC!")

    cy.wait(400)

    cy.get('#cvvcvc').clear().type("5g5")

    cy.wait(400)

    cy.get('#bookingForm').should("contain", "Invalid CVV/CVC!")

    cy.wait(400)

    cy.get('#cvvcvc').clear().type("555")

    cy.wait(400)

    cy.get('#bookingForm').should("not.contain", "Invalid CVV/CVC!")

    cy.wait(1000)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("not.contain", "Invalid phone number!")
    .and("not.contain", "Invalid email address!")
    .and("not.contain", "Invalid credit card number!")
    .and("not.contain", "Invalid expiry date!")
    .and("not.contain", "Invalid CVV/CVC!")

    cy.on('window:alert',(bookAlert)=>{
      expect(bookAlert).to.contains("Booking confirmed! Enjoy your trip!")})
  })
})