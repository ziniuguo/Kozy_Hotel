describe('Invalid empty form', () => {
  it('leaves booking form empty', () => {
    cy.visit('http://localhost:3000/booking/WaXd')

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