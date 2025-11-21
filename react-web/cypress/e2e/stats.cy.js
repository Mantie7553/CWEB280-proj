describe('Tests for the Stats page of the application', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173/stats');
        cy.viewport(1920,1080);
    });

    it('all lists are displayed', () => {
        cy.get('.list-section-team').should('exist');
        cy.get('.list-section-game').should('exist');

        cy.get('.list-header-collapsible').first().should('contain.text', 'GAMES');
        cy.get('.list-header-collapsible').eq(1).should('contain.text', 'TEAMS');
        cy.get('.list-header-collapsible').eq(2).should('contain.text', 'SERIES');
    });

    it('Teams list displays appropriate data', () => {
        cy.get('.list-header-collapsible').eq(1).parent()
            .within(() => {
                cy.get('.team-name').should('be.visible');
                cy.get('.team-stat-label').first().should('contain.text' , 'AVG POINTS');
                cy.get('.team-stat-label').eq(1).should('contain.text' , 'AVG DIFF');
                cy.get('.team-stat-label').eq(2).should('contain.text' , 'WIN RATE');
            })
    });

    it('both lists show at most 5 items per page', () => {
        cy.get('.list-header-collapsible').eq(1).parent()
            .within(() => {
                cy.get('.team-card').should('have.length', 5);
            })
        cy.get('.list-header-collapsible').first().parent()
            .within(() => {
                cy.get('.game-card').should('have.length', 5);
            })
    });

    it('win rate is shown as a decimal', () => {
        cy.get('.game-card').first().within(() => {
            cy.get('.game-stat-label').eq(2).parent()
                .find('.game-stat-value').invoke('text')
                .should('match', /^-?\d+\.?\d*$/);
        })
    });

    it('average points is shown as a decimal', () => {
        cy.get('.team-card').first().within(() => {
            cy.get('.team-stat-label').first().parent()
                .find('.team-stat-value').invoke('text')
                .should('match', /^-?\d+\.?\d*$/);
        })
    });

    it('Games list displays appropriate data', () => {
        cy.get('.game-card').first().within(() => {
            cy.get('.game-stats-info').should('be.visible');
            cy.get('.game-stat-label').first().should('contain.text', 'WIN RATE');
            cy.get('.game-stat-label').eq(1).should('contain.text', 'AVG POINTS');
            cy.get('.game-stat-label').eq(2).should('contain.text', 'AVG DIFF');
            })
    });

    it('pagination is displayed for all lists', () => {
        cy.get('.list-section-team').first().within(() => {
                cy.get('.pagination').should('exist').and('be.visible');
                cy.get('.pagination-button').should('exist');
            })

        cy.get('.list-section-game').within(() => {
                cy.get('.pagination').should('exist').and('be.visible');
                cy.get('.pagination-button').should('exist');
            })

        cy.get('.list-section-team').eq(1).within(() => {
            cy.get('.pagination').should('exist').and('be.visible');
            cy.get('.pagination-button').should('exist');
        })
    });

    it('navigates to next page of games', () => {
        cy.get('.list-section-game').within(() => {
                cy.get('.game-card').first()
                    .invoke('text')
                    .as('firstGamePage');

                cy.get('.pagination-button').last().click();

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
        cy.get('.list-section-game').within(() => {
                cy.get('.pagination-button').last().click();
                cy.wait(500);

                cy.get('.pagination-button').first().click();
                cy.wait(500);

                cy.get('.pagination-button.active').should('contain', '1');
            });
    });

    it('disables Previous button on first page', () => {
        cy.get('.list-section-game').within(() => {
            cy.get('.pagination-button').first().should('be.disabled');
            });
    });
})