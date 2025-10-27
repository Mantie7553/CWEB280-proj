describe('Tests for the home page of the application', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173');
        cy.viewport(1920,1080);
    });

    it('navbar at the top is rendered', () => {
        cy.get('.navbar-link').should('have.length', 3);
        cy.get('.navbar-title').should('contain', 'NBA GAME TRACKER');
        cy.contains('.navbar-link', 'HOME').should('be.visible');
        cy.contains('.navbar-link', 'STATS').should('be.visible');
        cy.contains('.navbar-link', 'LOGIN').should('be.visible');
        cy.contains('.navbar-link', 'DATA ENTRY').should('not.exist');
    });

    it('all three lists are displayed', () => {
        cy.get('.list-section-team').should('exist');
        cy.contains('.list-header', 'TOP TEAMS').should('be.visible');
        cy.contains('.list-header', 'UPCOMING').should('be.visible');
        cy.contains('.list-header', 'RECENT').should('be.visible');
    });

    it('top teams list displays data properly', () => {
        cy.contains('.list-header', 'TOP TEAMS').parent()
            .within(() => {
                cy.get('.team-card').should('exist');
                cy.contains('.team-stat-label', 'WIN RATE').should('exist');
                cy.contains('.team-stat-label', 'AVG POINTS').should('exist');
                cy.contains('.team-stat-label', 'AVG DIFF').should('exist');
            })
    });

    it('upcoming games list displays data properly', () => {
        cy.contains('.list-header', 'UPCOMING').parent()
            .within(() => {
                cy.get('.game-card').should('exist');
                cy.contains('.game-team-label', 'AWAY').should('exist');
                cy.contains('.game-team-label', 'HOME').should('exist');
            })
    });

    it('recent games list displays game data with scores', () => {
        cy.contains('.list-header', 'RECENT').parent()
            .within(() => {
                cy.get('.game-card').should('exist');
                cy.contains('.game-score-label', 'SCORE').should('exist');
                cy.get('.game-score-value').invoke('text').should('match', /^\d*$/);
            })
    });

    it('loading state is handled properly', () => {
        cy.intercept('GET', '**/team/top', (req) => {
            req.continue((res) => {
                res.delay = 1000;
            })
        }).as('topTeams');

        cy.visit('http://localhost:5173');

        cy.contains('Loading...').should('be.visible');
        cy.wait('@topTeams');
        cy.contains('Loading...').should('not.exist');
    });

    it('Login button opens login modal', () => {
        cy.get('.modal-overlay').should('not.exist');

        cy.contains('.navbar-link', 'LOGIN').click();

        cy.get('.modal-overlay').should('exist');
        cy.get('.modal-title').should('contain', 'LOGIN');

        cy.get('input[type=email]').should('exist');
        cy.get('input[type=password]').should('exist');

        cy.get('.modal-close').click();
        cy.get('.modal-overlay').should('not.exist');
    });
});