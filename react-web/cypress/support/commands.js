Cypress.Commands.add('DatabaseReset', () => {
    cy.request('GET', `${Cypress.env(import.meta.envVITE_API_BASE_URL)}/api/load`)
        .its('status')
        .should('eq',200);
})