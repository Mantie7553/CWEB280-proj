describe('Tests for Series functionality', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173');
        cy.viewport(1920, 1080);
    });

    describe('Add Series Passes', () => {
        beforeEach(() => {
            Login();
            cy.visit('http://localhost:5173/data-entry');
        });

        it('successfully creates a new series with all required fields', () => {
            cy.get('.btn-primary').eq(1).click();

            cy.get('.modal-overlay').should('be.visible');
            cy.get('.modal-title').should('contain.text', 'Create Series');

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').type('Test Playoff Series 2025');
            });

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').type('Playoff Series');
            });

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="date"]').first().type('2025-04-15');
                cy.get('input[type="date"]').last().type('2025-05-20');
            });

            cy.get('.form-group').last().within(() => {
                cy.get('input[type="text"]').type('Eastern Conference Finals matchup');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.on('window:alert', (text) => {
                expect(text).to.contains('created successfully');
            });

            cy.get('.modal-overlay', { timeout: 1000 }).should('not.exist');
        });

        it('new series appears in series list on stats page', () => {
            cy.get('.btn-primary').eq(1).click();

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').type('Unique Series Name');
            });

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').type('Regular Season');
            });

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="date"]').first().type('2025-01-01');
                cy.get('input[type="date"]').last().type('2025-01-31');
            });

            cy.get('.form-group').last().within(() => {
                cy.get('input[type="text"]').type('January matchups');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.wait(1000);

            cy.visit('http://localhost:5173/stats');
            cy.wait(500);

            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').should('exist');
                    cy.get('.series-text-lg').should('contain.text', 'Unique Series Name');
                });
        });
    });

    describe('Add Series fails', () => {
        beforeEach(() => {
            Login();
            cy.visit('http://localhost:5173/data-entry');
        });

        it('shows error when series name is missing', () => {
            cy.get('.btn-primary').eq(1).click();

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').type('Playoff Series');
            });

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="date"]').first().type('2025-04-15');
                cy.get('input[type="date"]').last().type('2025-05-20');
            });

            cy.get('.form-group').last().within(() => {
                cy.get('input[type="text"]').type('Test description');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.get('input[type="text"]:invalid').should('exist');
            cy.get('.modal-overlay').should('be.visible');
        });

        it('shows error when series type is missing', () => {
            cy.get('.btn-primary').eq(1).click();

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').type('Test Series');
            });

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="date"]').first().type('2025-04-15');
                cy.get('input[type="date"]').last().type('2025-05-20');
            });

            cy.get('.form-group').last().within(() => {
                cy.get('input[type="text"]').type('Test description');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.get('input[type="text"]:invalid').should('exist');
            cy.get('.modal-overlay').should('be.visible');
        });

        it('shows error when start date is missing', () => {
            cy.get('.btn-primary').contains('CREATE SERIES').click();

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').type('Test Series');
            });

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').type('Playoff Series');
            });

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="date"]').last().type('2025-05-20');
            });

            cy.get('.form-group').last().within(() => {
                cy.get('input[type="text"]').type('Test description');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.get('input[type="date"]:invalid').should('exist');
            cy.get('.modal-overlay').should('be.visible');
        });

        it('shows error when end date is missing', () => {
            cy.get('.btn-primary').contains('CREATE SERIES').click();

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').type('Test Series');
            });

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').type('Playoff Series');
            });

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="date"]').first().type('2025-04-15');
            });

            cy.get('.form-group').last().within(() => {
                cy.get('input[type="text"]').type('Test description');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.get('input[type="date"]:invalid').should('exist');
            cy.get('.modal-overlay').should('be.visible');
        });

        it('shows error when description is missing', () => {
            cy.get('.btn-primary').contains('CREATE SERIES').click();

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').type('Test Series');
            });

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').type('Playoff Series');
            });

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="date"]').first().type('2025-04-15');
                cy.get('input[type="date"]').last().type('2025-05-20');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.get('input[type="text"]:invalid').should('exist');
            cy.get('.modal-overlay').should('be.visible');
        });
    });

    describe('Add Games to Series', () => {
        beforeEach(() => {
            Login();
            cy.visit('http://localhost:5173/');
        });

        it('navigates to series detail page from series list', () => {
            cy.get('.list-header').eq(1).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(250);
            cy.url().should('include', '/series/');
            cy.get('.series-header').should('exist');
            cy.get('.series-title').should('exist');
        });

        it('opens add games modal from series detail page', () => {
            cy.get('.list-header').eq(1).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(250);

            cy.get('.series-buttons').within(() => {
                cy.get('.btn-secondary').eq(1).click();
            });

            cy.get('.modal-overlay').should('be.visible');
            cy.get('.modal-title').should('contain.text', 'Add Games to Series');
        });

        it('successfully adds games to series', () => {
            cy.get('.list-header').eq(1).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(250);

            cy.get('.series-text').invoke('text').then((text) => {

                cy.get('.series-buttons').within(() => {
                    cy.get('.btn-secondary').eq(1).click();
                });

                cy.wait(500);

                cy.get('.modal-overlay').within(() => {
                    cy.get('.game-card').first().within(() => {
                        cy.get('.btn-secondary').click();
                        cy.wait(200);
                    });
                    cy.get('.game-card').last().within(() => {
                        cy.get('.btn-secondary').click();
                        cy.wait(200);
                    });

                    cy.get('.modal-info').should('contain.text', '2 game(s)');

                    cy.get('.form-buttons').within(() => {
                        cy.get('.btn-primary').click();
                    });
                });

                cy.wait(1000);

                cy.get('.game-card').should('have.length', 6);

            });
        });


        it('games are shown as part of the series after adding', () => {
            cy.get('.list-header').eq(1).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(500);

            cy.get('.game-card').its('length').as('initialGameCount');

            cy.get('.series-buttons').within(() => {
                cy.get('.btn-secondary').eq(1).click();
            });

            cy.wait(500);

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-secondary').first().click();

                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);

            cy.get('@initialGameCount').then((initialCount) => {
                cy.get('.game-card').should('have.length.at.least', initialCount);
            });
        });
    });

    describe('List Series', () => {
        beforeEach(() => {
            cy.visit('http://localhost:5173/stats');
        });

        it('displays series list on stats page', () => {
            cy.get('.list-header-collapsible').eq(2).should('contain.text', 'SERIES');

            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').should('exist');
                });
        });

        it('displays all series information correctly', () => {
            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').first().within(() => {
                        cy.get('.series-text-lg').should('exist');
                        cy.get('.series-text').should('contain.text', 'to');
                        cy.get('.series-text').should('contain.text', 'Games:');
                    });
                });
        });

        it('series list is paginated', () => {
            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.pagination').should('exist').and('be.visible');
                    cy.get('.pagination-button').should('exist');
                });
        });

        it('shows at most 5 series per page', () => {
            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').should('have.length.at.most', 5);
                });
        });
    });

    describe('Edit Series', () => {
        beforeEach(() => {
            Login();
            cy.visit('http://localhost:5173/stats');
        });

        it('opens edit modal when clicking on series in list', () => {
            cy.get('.list-section-team').eq(1).within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.get('.modal-overlay').should('be.visible');
            cy.get('.modal-title').should('contain.text', 'Edit Series');
        });

        it('edit modal is pre-filled with existing series data', () => {
            cy.get('.list-section-team').eq(1).within(() => {
                    cy.get('.series-card').first().within(() => {
                        cy.get('.series-text-lg').eq(1).invoke('text').as('seriesName');
                    });
                    cy.get('.series-card').first().click();
                });

            cy.wait(500);

            cy.get('@seriesName').then((name) => {
                cy.get('.form-group').eq(0).within(() => {
                    cy.get('input[type="text"]').should('have.value', name);
                });
            });
        });

        it('successfully updates series name', () => {
            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(500);

            const newName = 'Updated Series Name ' + Date.now();

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').clear().type(newName);
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.on('window:alert', (text) => {
                expect(text).to.contains('updated successfully');
            });

            cy.wait(1000);

            cy.get('.series-text-lg').eq(1).should('contain.text', newName);
        });

        it('successfully updates series type', () => {
            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(500);

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').clear().type('Championship Series');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.wait(1000);

            cy.get('.series-text-lg').first().should('contain.text', 'Championship Series');
        });

        it('successfully updates start date', () => {
            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(500);

            cy.get('input[type="date"]').first().clear().type('2025-06-01');

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.wait(1000);

            cy.get('.series-text').first().should('contain.text', '2025-06-01');
        });


        it('changes are displayed in series list after update', () => {
            const uniqueName = 'Verify List Update ' + Date.now();

            cy.get('.series-card').first().click();

            cy.wait(500);

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').clear().type(uniqueName);
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.wait(1000);

            cy.visit('http://localhost:5173/stats');
            cy.wait(500);

            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-text-lg').eq(1).should('contain.text', uniqueName);
                });
        });
    });

    describe('Delete Series', () => {
        beforeEach(() => {
            Login();
            cy.visit('http://localhost:5173');
        });

        it('shows delete button on series detail page', () => {
            cy.get('.series-card').first().click();

            cy.wait(500);

            cy.get('.series-buttons').within(() => {
                cy.get('.btn-secondary').first().should('contain.text', 'EDIT');
            });

            cy.get('.series-buttons').within(() => {
                cy.get('.btn-secondary').first().click();
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-secondary').first().should('contain.text', 'DELETE SERIES');
            });
        });

        it('shows confirmation dialog when delete is clicked', () => {
            cy.get('.series-card').first().click();

            cy.wait(500);

            cy.get('.series-buttons').within(() => {
                cy.get('.btn-secondary').first().click();
            });

            cy.on('window:confirm', () => false);

            cy.get('.modal-content').within(() => {
                cy.get('.btn-secondary').first().click();
            });
        });

        it('successfully deletes series after confirmation', () => {
            // First create a unique series to delete
            cy.visit('http://localhost:5173/data-entry');
            cy.wait(500);

            const uniqueName = 'Delete Test Series ' + Date.now();

            cy.get('.btn-primary').contains('CREATE SERIES').click();

            cy.get('.form-group').eq(0).within(() => {
                cy.get('input[type="text"]').type(uniqueName);
            });

            cy.get('.form-group').eq(1).within(() => {
                cy.get('input[type="text"]').type('Test Type');
            });

            cy.get('.modal-content').within(() => {
                cy.get('input[type="date"]').first().type('2025-07-01');
                cy.get('input[type="date"]').last().type('2025-07-15');
            })

            cy.get('.form-group').last().within(() => {
                cy.get('input[type="text"]').type('Test description');
            });

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').click();
            });

            cy.wait(1000);

            cy.visit('http://localhost:5173/stats');
            cy.wait(500);

            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(500);

            cy.on('window:confirm', () => true);

            cy.get('.modal-content').within(() => {
                cy.get('.btn-secondary').first().click();
            });

            cy.on('window:alert', (text) => {
                expect(text).to.contains('deleted successfully');
            });

            cy.wait(1000);

            cy.visit('http://localhost:5173/stats');
            cy.wait(500);

            cy.get('.list-header-collapsible').eq(2).parent()
                .within(() => {
                    cy.get('.series-text-lg').should('not.contain.text', uniqueName);
                });
        });

        it('series no longer shows in list after deletion', () => {
            cy.get('.series-card').its('length').as('initialCount');
            cy.get('.series-card').first().within(() => {
                cy.get('.series-text-lg').eq(1).invoke('text').as('deletedSeriesName');
            });
            cy.get('.series-card').first().click();

            cy.wait(500);

            cy.get('.series-buttons').within(() => {
                cy.get('.btn-secondary').first().click();
            });

            cy.on('window:confirm', () => true);

            cy.get('.modal-content').within(() => {
                cy.get('.btn-secondary').first().click();
            });

            cy.wait(1000);

            cy.get('.error-container').should('exist');
        });
    });

    describe('Featured Series on Home Page', () => {
        beforeEach(() => {
            cy.visit('http://localhost:5173');
        });

        it('displays featured series section on home page', () => {
            cy.get('.list-header').should('contain.text', 'FEATURED SERIES');
        });

        it('featured series shows at most 3 series', () => {
            cy.contains('.list-header', 'FEATURED SERIES').parent()
                .within(() => {
                    cy.get('.series-card').should('have.length.at.most', 3);
                });
        });

        it('clicking featured series navigates to series detail page', () => {
            cy.contains('.list-header', 'FEATURED SERIES').parent()
                .within(() => {
                    cy.get('.series-card').first().click();
                });

            cy.wait(500);
            cy.url().should('include', '/series/');
            cy.get('.series-header').should('exist');
        });
    });
});

function Login() {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="btn-login"]').click();
    cy.get('input[type=email]').type('test@t.ca');
    cy.wait(500);
    cy.get('input[type=password]').type('123456Pw');
    cy.wait(500);
    cy.get('.btn-primary').contains('Login').click();
    cy.wait(500);
}