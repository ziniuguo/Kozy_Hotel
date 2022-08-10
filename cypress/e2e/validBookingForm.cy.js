describe('Valid form inputs', () => {
  it('fills up valid booking form', () => {
    cy.visit('http://localhost:3000/booking/WaXd')
    

    cy.wait(2000)

    cy.get('#firstname').type("Billy")

    cy.wait(500)

    cy.get('#lastname').type("Yeo")

    cy.wait(500)

    cy.get('#phonenum').type("88883333")

    cy.wait(500)

    cy.get('#email').type("billy.yeo@hotmail.com")

    cy.wait(500)

    cy.get('#sprequests').type("An extra blanket")

    cy.wait(500)

    cy.get('#creditcardNo').type("3333333355556666")

    cy.wait(500)

    cy.get('#cardexpiry').type("02/2022")

    cy.wait(500)

    cy.get('#cvvcvc').type("222")

    cy.wait(500)

    cy.get('#billing').type("55 SendHelp Road")

    cy.wait(1000)

    cy.get('#submitbooking').click()

    cy.on('window:alert',(bookAlert)=>{
      expect(bookAlert).to.contains("Booking confirmed! Enjoy your trip!")})



  })
})