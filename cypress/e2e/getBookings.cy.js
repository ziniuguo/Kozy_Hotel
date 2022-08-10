describe('empty spec', () => {
  it('passes', () => {

    cy.request("http://localhost:5000/getbookings/guo.ziniu.1003@gmail.com").as('getbook')

    cy.get('@getbook').should((response) => {


      for(let e = 0; e < response.body.length; e++){
        expect((response.body)[e]).to.have.property('firstName')
        expect((response.body)[e]).to.have.property('lastName')
        expect((response.body)[e]).to.have.property('phoneNumber')
        expect((response.body)[e]).to.have.property('emailAddress')
        expect((response.body)[e].emailAddress).to.equal("guo.ziniu.1003@gmail.com")
        expect((response.body)[e]).to.have.property('creditCardNumber')
        expect((response.body)[e]).to.have.property('cardExpiry')
        expect((response.body)[e]).to.have.property('CVV_CVC')
        expect((response.body)[e]).to.have.property('billingAddress')

      }



      
    })

    
  })
})