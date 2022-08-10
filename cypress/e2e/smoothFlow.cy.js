describe('Smooth, valid test', () => {
  it('goes through entire process', () => {
    cy.visit('http://localhost:3000/')
    

    cy.wait(1000)
  
    cy.contains('Book Now').click()

    cy.wait(4000)

    cy.contains('Book').click()

    cy.wait(4000)

    cy.contains('Book Now').click()

    cy.wait(2000)


    cy.get('#firstname').type("Warren")

    cy.wait(500)

    cy.get('#lastname').type("Lee")

    cy.wait(500)

    cy.get('#phonenum').type("99992222")

    cy.wait(500)

    cy.get('#email').type("warren.fake@hotmail.com")

    cy.wait(500)

    cy.get('#sprequests').type("One more pillow")

    cy.wait(500)

    cy.get('#creditcardNo').type("5555222277778888")

    cy.wait(500)

    cy.get('#cardexpiry').type("05/2055")

    cy.wait(500)

    cy.get('#cvvcvc').type("777")

    cy.wait(500)

    cy.get('#billing').type("55 SendTherapy Road")

    cy.wait(1000)

    cy.get('#submitbooking').click()

    cy.on('window:alert',(bookAlert)=>{
      expect(bookAlert).to.contains("Booking confirmed! Enjoy your trip!")})



  })
})