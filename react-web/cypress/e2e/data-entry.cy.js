describe('Tests for the Stats page of the application', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173/data-entry');
        cy.viewport(1920,1080);
    });

    it('shows DATA ENTRY link only when authenticated', () => {
        cy.visit('http://localhost:5173/');

        cy.get('[data-cy="btn-login"]').should('exist');
        cy.get('[data-cy="btn-login"]').click();

        Login();

        cy.get('[data-cy="btn-login"]').should('not.exist');
    });

    it('successfully adds a game', () => {

        cy.get('select').first().select(1);

        cy.get('select').eq(1).select(2);

        cy.get('input[type="date"], input[type="datetime-local"]')
            .type('2025-12-01');

        cy.get('input[type="number"]').first().type('110');
        cy.get('input[type="number"]').eq(1).type('105');

        cy.get('.data-entry-container').within(() => {
            cy.get('.btn-primary').click();
        })

        cy.on('window:alert', (text) => {
            expect(text).to.contains('added successfully');
        });

        cy.get('.modal-overlay', { timeout: 5000 }).should('not.exist');
    });

    it('date picker works properly', () => {
        const today = new Date().toISOString().split('T')[0];

        cy.get('input[type="date"], input[type="datetime-local"]')
            .type(today)
            .should('have.value', today);
    });
});

describe('Testing for add team modal', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173/data-entry');
        cy.viewport(1920,1080);
    });

    it('opens team addition modal when button clicked', () => {
        cy.get('.modal-overlay').should('not.exist');

        cy.get('.btn-link').first().click();

        cy.get('.modal-overlay').should('be.visible');
        cy.get('.modal-title').should('contain.text', 'Add Team');
    });

    it('displays all required fields in team modal', () => {
        cy.get('.btn-link').first().click();

        cy.get('.modal-content').within(() => {
            cy.get('.form-label').first().should('contain.text', 'Team Name');
            cy.get('input[type="text"]').should('exist');

            cy.get('.form-label').eq(1).should('contain.text', 'Team Logo');
            cy.get('input[type="file"]').should('exist');

            cy.get('.btn-primary').should('exist');
            cy.get('.btn-secondary').should('exist');
        });
    });

    it('can close the modal with both the cancel and X buttons', () => {
        cy.get('.btn-link').first().click();
        cy.get('.modal-overlay').should('be.visible');

        cy.get('.modal-overlay').within(() => {
            cy.get('.btn-secondary').eq(1).click();
        });
        cy.get('.modal-overlay').should('not.exist');

        cy.get('.btn-link').first().click();
        cy.get('.modal-overlay').should('be.visible');

        // Assuming there's a close button (adjust selector if needed)
        cy.get('.modal-close, .modal-content button[type="button"]').first().click();
        cy.get('.modal-overlay').should('not.exist');
    });

    it('validates team name field', () => {
        cy.get('.btn-link').first().click();

        cy.get('.modal-overlay').within(() => {
            cy.get('.btn-primary').click();
        });

        cy.get('input[type="text"]:invalid').should('exist');
    });

    it('successfully adds a team', () => {
        cy.get('.btn-link').first().click();

        cy.get('.modal-content').within(() => {
            cy.get('input[type="text"]').type('New Test Team');
                cy.get('.btn-primary').click();
        });

        cy.on('window:alert', (text) => {
            expect(text).to.contains('added successfully');
        });

        cy.get('.modal-overlay', { timeout: 500 }).should('not.exist');
    });

    it('form is cleared when re-opening modal', () => {
        cy.get('.btn-link').first().click();
        cy.get('input[type="text"]').type('Test Team');

        cy.get('.modal-overlay').within(() => {
            cy.get('.btn-secondary').eq(1).click();
        });

        cy.get('.btn-link').first().click();

        cy.get('input[type="text"]').should('have.value', '');
        cy.get('img[src^="blob:"]').should('not.exist');
    });



})

function Login() {
    cy.get('input[type=email]').type('test@t.ca');
    cy.wait(500);
    cy.get('input[type=password]').type('123456Pw');
    cy.wait(500);
    cy.get('.btn-primary').contains('Login').click();
}