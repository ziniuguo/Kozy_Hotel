describe('empty spec', () => {
  it('passes', () => {

    cy.request("http://localhost:5000/getbookings/testing.out@gmail.com").as('getbook')

    cy.get('@getbook').should((response) => {
      expect((response.body)[0]).to.have.property('firstName')
      expect((response.body)[0]).to.have.property('lastName')
      expect((response.body)[0]).to.have.property('phoneNumber')
      expect((response.body)[0]).to.have.property('emailAddress')
      expect((response.body)[0]).to.have.property('creditCardNumber')
      expect((response.body)[0]).to.have.property('cardExpiry')
      expect((response.body)[0]).to.have.property('CVV_CVC')
      expect((response.body)[0]).to.have.property('billingAddress')
      
    })

    
  })
})