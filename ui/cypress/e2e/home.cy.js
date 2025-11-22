describe('Tests for the home page of the application', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173');
        cy.viewport(1920,1080);
    });

    it('navbar at the top is rendered', () => {
        cy.get('.navbar-link').should('have.length', 3);
        cy.get('.navbar-title').should('contain', 'NBA GAME TRACKER');
        cy.get('.navbar-link').first().should('contain.text', 'HOME');
        cy.get('.navbar-link').eq(1).should('contain.text', 'STATS');
        cy.get('.navbar-link').eq(2).should('contain.text', 'LOGIN');
    });

    it('all lists are displayed', () => {
        cy.get('.list-section-team').should('exist');
        cy.get('.list-section-team').first().within(() => {
            cy.get('.list-header').should('contain.text', 'TOP TEAMS');
        });

        cy.get('.list-section-game').first().within(() => {
            cy.get('.list-header').should('contain.text', 'UPCOMING');
        });

        cy.get('.list-section-game').eq(1).within(() => {
            cy.get('.list-header').should('contain.text', 'RECENT');
        });

        cy.get('.list-section-team').eq(1).within(() => {
            cy.get('.list-header').should('contain.text', 'FEATURED SERIES');
        });
    });

    it('top teams list displays data properly', () => {
        cy.get('.list-section-team').first().parent()
            .within(() => {
                cy.get('.team-card').should('exist');
                cy.get('.team-stat-label').first().should('contain.text', 'AVG POINTS');
                cy.get('.team-stat-label').eq(1).should('contain.text', 'AVG DIFF');
                cy.get('.team-stat-label').eq(2).should('contain.text', 'WIN RATE');
            })
    });

    it('upcoming games list displays data properly', () => {
        cy.get('.list-section-game').first().parent()
            .within(() => {
                cy.get('.game-card').should('exist');
                cy.get('.game-team-label').first().should('contain.text', 'AWAY');
                cy.get('.game-team-label').eq(1).should('contain.text', 'HOME');
            })
    });

    it('recent games list displays game data with scores', () => {
        cy.get('.list-section-game').eq(1).parent()
            .within(() => {
                cy.get('.game-card').should('exist');
                cy.get('.game-score-label').should('contain.text', 'SCORE');

                cy.get('.game-score-value').invoke('text').should('match', /^\d*$/);
            })
    });

    it('Login button opens login modal', () => {
        cy.get('.modal-overlay').should('not.exist');

        cy.get('[data-cy="btn-login"]').click();

        cy.get('.modal-overlay').should('exist');
        cy.get('.modal-title').should('contain', 'LOGIN');

        cy.get('input[type=email]').should('exist');
        cy.get('input[type=password]').should('exist');

        cy.get('.modal-close').click();
        cy.get('.modal-overlay').should('not.exist');
    });
});