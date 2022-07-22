describe('booking form', () => {
  it('rejects empty form', () => {
    cy.visit('http://localhost:3000/')

    cy.wait(1000)
  
    cy.contains('Book Now').click()

    cy.wait(3000)

    cy.contains('Book').click()

    cy.wait(3000)

    cy.contains('Book Now').click()

    cy.wait(2000)

    cy.get('#submitbooking').click()

    cy.get('#bookingForm').should("contain", "First name is required!")
    .and("contain", "Last name is required!")
    .and("contain", "Phone number is required")
    .and("contain", "Email address is required")
    .and("contain", "Credit card number is required")
    .and("contain", "Credit card expiry date is required")
    .and("contain", "CVV/CVC is required")
    .and("contain", "Billing address is required")
    
    



  })
})