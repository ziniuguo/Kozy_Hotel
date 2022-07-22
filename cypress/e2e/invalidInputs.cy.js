describe('booking form inputs', () => {
  it('rejects invalid phone number', () => {
    cy.visit('http://localhost:3000/')


    cy.wait(1000)
  
    cy.contains('Book Now').click()

    cy.wait(3000)

    cy.contains('Book').click()

    cy.wait(3000)

    cy.contains('Book Now').click()

    cy.wait(2000)

    cy.get('#firstname').type("Billy")

    cy.get('#lastname').type("Yeo")

    cy.wait(1000)

    cy.get('#phonenum').type("hellothere")
    
    cy.wait(2000)

    cy.get('#email').type("billy.yeo@hotmail.com")

    cy.get('#sprequests').type("An extra blanket")

    cy.get('#creditcardNo').type("3333333355556666")

    cy.get('#cardexpiry').type("02/2022")

    cy.get('#cvvcvc').type("222")

    cy.get('#billing').type("55 SendHelp Road")
  })
})