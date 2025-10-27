describe('Tests for the Stats page of the application', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173/stats');
        cy.viewport(1920,1080);
    });

    it('both lists are displayed', () => {
        cy.get('.list-section-team').should('exist');
        cy.contains('.list-header', 'GAMES').should('be.visible');
        cy.contains('.list-header', 'TEAMS').should('be.visible');
    });

    it('Teams list displays appropriate data', () => {
        cy.contains('.list-header', 'TEAMS').parent()
            .within(() => {
                cy.get('.team-name').should('be.visible');
                cy.contains('.team-stat-label', 'AVG POINTS').should('exist');
                cy.contains('.team-stat-label', 'AVG DIFF').should('exist');
                cy.contains('.team-stat-label', 'WIN RATE').should('exist');
            })
    });

    it('both lists show at most 5 items per page', () => {
        cy.contains('.list-header', 'TEAMS').parent()
            .within(() => {
                cy.get('.team-card').should('have.length', 5);
            })
        cy.contains('.list-header', 'GAMES').parent()
            .within(() => {
                cy.get('.game-card').should('have.length', 5);
            })
    });

    it('win rate is shown as a percentage', () => {
        cy.contains('.list-header', 'TEAMS').parent()
            .within(() => {
                cy.contains('.team-stat-label', 'WIN RATE').parent()
                    .find('.team-stat-value').invoke('text')
                    .should('match', /^\d+\.\d%$/);
            })
    });

    it('average points is shown as a decimal', () => {
        cy.contains('.list-header', 'TEAMS').parent()
            .within(() => {
                cy.contains('.team-stat-label', 'AVG POINTS').parent()
                    .find('.team-stat-value').invoke('text')
                    .should('match', /^\d+(\.\d+)?$/);
            })
    });

    it('Teams list displays appropriate data', () => {
        cy.contains('.list-header', 'GAMES').parent()
            .within(() => {
                cy.get('.game-stats-info').should('be.visible');
                cy.contains('.game-stat-label', 'AVG POINTS').should('exist');
                cy.contains('.game-stat-label', 'AVG DIFF').should('exist');
                cy.contains('.game-stat-label', 'WIN RATE').should('exist');
            })
    });

    it('pagination is displayed for both lists', () => {
        cy.contains('.list-header', 'TEAMS').parent()
            .within(() => {
                cy.get('.pagination').should('exist').and('be.visible');
                cy.get('.pagination-button').should('exist');
            })
        cy.contains('.list-header', 'GAMES').parent()
            .within(() => {
                cy.get('.pagination').should('exist').and('be.visible');
                cy.get('.pagination-button').should('exist');
            })
    });

    it('navigates to next page of games', () => {
        cy.contains('.list-header', 'GAMES')
            .parent()
            .within(() => {
                cy.get('.game-card').first()
                    .invoke('text')
                    .as('firstGamePage');

                cy.contains('.pagination-button', 'Next').click();

                cy.get('.game-card', { timeout: 500 }).should('exist');

                cy.get('.pagination-button.active').should('contain', '2');

                cy.get('@firstGamePage').then((firstTeam) => {
                    cy.get('.game-card').first()
                        .invoke('text')
                        .should('not.equal', firstTeam);
                });
            });
    });

    it('navigates to previous page of games', () => {
        cy.contains('.list-header', 'GAMES')
            .parent()
            .within(() => {
                cy.contains('.pagination-button', 'Next').click();
                cy.wait(500);

                cy.contains('.pagination-button', 'Previous').click();
                cy.wait(500);

                cy.get('.pagination-button.active').should('contain', '1');
            });
    });

    it('disables Previous button on first page', () => {
        cy.contains('.list-header', 'GAMES')
            .parent()
            .within(() => {
                cy.contains('.pagination-button', 'Previous')
                    .should('be.disabled');
            });
    });
})