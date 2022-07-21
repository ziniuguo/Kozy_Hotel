describe('Initial test', () => {
  it('visits the webpage', () => {
    cy.visit('http://localhost:3000/')
    //expect(true).to.equal(true)
    cy.contains('Book Now').click()

    cy.contains('Book').click()

    cy.contains('Book Now').click()

    cy.get('#firstname').type("Billy")

    cy.get('#lastname').type("Yeo")

    cy.get('#phonenum').type("88883333")

    cy.get('#email').type("billy.yeo@hotmail.com")

    cy.get('#sprequests').type("An extra blanket")

    cy.get('#creditcardNo').type("3333333355556666")

    cy.get('#cardexpiry').type("02/2022")

    cy.get('#cvvcvc').type("222")

    cy.get('#billing').type("55 SendHelp Road")

    cy.get('#submitbooking').click()





  })
})