describe('Tests for login functionality', () => {
    beforeEach(() => {
        cy.request('GET', 'http://127.0.0.1:8080/api/load');
        cy.visit('http://localhost:5173');
        cy.viewport(1920, 1080);
    });

    describe('Login Modal Display', () => {

        it('opens login modal when login button is clicked', () => {
            cy.get('.modal-overlay').should('not.exist');

            cy.get('[data-cy="btn-login"]').click();

            cy.get('.modal-overlay').should('exist');
            cy.get('.modal-overlay').should('be.visible');
            cy.get('.modal-title').should('contain.text', 'LOGIN');
            cy.get('input[type="email"]').should('exist');
            cy.get('input[type="password"]').should('exist');
        });

        it('closes login modal when cancel button is clicked', () => {
            cy.get('[data-cy="btn-login"]').click();
            cy.get('.modal-overlay').should('be.visible');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-secondary').first().click();
            })

            cy.get('.modal-overlay').should('not.exist');
        });

        it('closes login modal when X button is clicked', () => {
            cy.get('[data-cy="btn-login"]').click();
            cy.get('.modal-overlay').should('be.visible');

            cy.get('.modal-close').click();

            cy.get('.modal-overlay').should('not.exist');
        });
    });

    describe('Login Success', () => {
        it('successfully logs in with valid credentials', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="email"]').type('test@t.ca');
            cy.get('input[type="password"]').type('123456Pw');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);

            cy.get('.modal-overlay').should('not.exist');
            cy.get('[data-cy="btn-login"]').should('not.exist');
        });

        it('displays DATA ENTRY link after successful login', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="email"]').type('test@t.ca');
            cy.get('input[type="password"]').type('123456Pw');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);

            cy.get('.navbar-link').eq(2).should('contain.text', 'DATA ENTRY');
        });

        it('user can access data entry page after login', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="email"]').type('test@t.ca');
            cy.get('input[type="password"]').type('123456Pw');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);

            cy.get('.navbar-link').eq(2).click();

            cy.url().should('include', '/data-entry');
            cy.get('.data-entry-container').should('exist');
        });

        it('login persists after page refresh', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="email"]').type('test@t.ca');
            cy.get('input[type="password"]').type('123456Pw');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);

            cy.reload();

            cy.get('.navbar-link').eq(2).should('contain.text', 'DATA ENTRY');
        });
    });

    describe('Login Failure', () => {
        it('shows error with invalid email', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="email"]').type('invalid@email.com');
            cy.get('input[type="password"]').type('wrongpassword');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);

            cy.get('.modal-overlay').should('be.visible');
        });

        it('shows error with incorrect password', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="email"]').type('test@t.ca');
            cy.get('input[type="password"]').type('wrongpassword');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);

            cy.get('.modal-overlay').should('be.visible');
        });

        it('shows validation error when email field is empty', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="password"]').type('123456Pw');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.get('input[type="email"]:invalid').should('exist');
            cy.get('.modal-overlay').should('be.visible');
        });

        it('shows validation error when password field is empty', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('input[type="email"]').type('test@t.ca');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.get('input[type="password"]:invalid').should('exist');
            cy.get('.modal-overlay').should('be.visible');
        });

    });

    describe('Registration', () => {
        it('can switch from login to registration mode', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('.modal-title').should('contain.text', 'LOGIN');

            cy.contains('Register here').click();

            cy.get('.modal-title').should('contain.text', 'CREATE ACCOUNT');
        });

        it('registration form displays all required fields', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.get('button').last().click();

            cy.get('.modal-overlay').within(() => {
                cy.get('input[type="email"]').should('exist');
                cy.get('input[type="password"]').should('exist');
                cy.get('.btn-primary').contains('Register').should('exist');
            });
        });

        it('successfully registers a new user', () => {
            const uniqueEmail = `test${Date.now()}@test.com`;

            cy.get('[data-cy="btn-login"]').click();

            cy.get('button').last().click();

            cy.get('input[type="email"]').type(uniqueEmail);
            cy.get('input[type="password"]').type('TestPass123');
            cy.get('.btn-primary').contains('Register').click();

            cy.wait(1000);

            cy.get('.modal-overlay').should('not.exist');
            cy.get('.navbar-button').contains('ACCOUNT').should('exist');
        });

        it('shows error when registering with existing email', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.contains('Register here').click();

            cy.get('input[type="email"]').type('test@t.ca');
            cy.get('input[type="password"]').type('NewPass123');
            cy.get('.btn-primary').contains('Register').click();

            cy.wait(1000);

            cy.get('.modal-overlay').should('be.visible');
            cy.get('.modal-error').should('exist');
        });

        it('shows error when password is too short', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.contains('Register here').click();

            cy.get('input[type="email"]').type('newuser@test.com');
            cy.get('input[type="password"]').type('short');
            cy.get('.btn-primary').contains('Register').click();

            cy.get('.modal-overlay').should('be.visible');
        });

        it('password field shows minimum 8 character requirement', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.contains('Register here').click();

            cy.get('.form-label').contains('Password').should('contain.text', 'min. 8 characters');
        });

        it('can switch from registration back to login', () => {
            cy.get('[data-cy="btn-login"]').click();

            cy.contains('Register here').click();

            cy.get('.modal-title').should('contain.text', 'CREATE ACCOUNT');

            cy.contains('Login here').click();

            cy.get('.modal-title').should('contain.text', 'LOGIN');
        });

    });

    describe('Logout', () => {
        beforeEach(() => {
            // Login before each logout test
            cy.get('[data-cy="btn-login"]').click();
            cy.get('input[type="email"]').type('test@t.ca');
            cy.get('input[type="password"]').type('123456Pw');

            cy.get('.modal-overlay').within(() => {
                cy.get('.btn-primary').first().click();
            });

            cy.wait(1000);
        });

        it('displays account dropdown when ACCOUNT button is clicked', () => {
            cy.get('.navbar-button').last().click();

            cy.get('.navbar-dropdown').should('be.visible');
            cy.get('.navbar-dropdown-button').first().should('contain.text', 'LOG OUT');
            cy.get('.navbar-dropdown-button').last().should('contain.text', 'DELETE ACCOUNT');
        });

        it('successfully logs out user', () => {
            cy.get('.navbar-button').last().click();
            cy.get('.navbar-dropdown-button').first().click();

            cy.wait(500);

            cy.get('[data-cy="btn-login"]').should('exist');
        });

        it('DATA ENTRY link is hidden after logout', () => {
            cy.get('.navbar-button').last().click();
            cy.get('.navbar-dropdown-button').first().click();

            cy.wait(500);

            cy.get('.navbar-link').eq(2).should('not.contain.text', 'DATA ENTRY');
        });

        it('cannot access data entry page after logout', () => {
            cy.get('.navbar-button').last().click();
            cy.get('.navbar-dropdown-button').first().click();

            cy.wait(500);

            cy.get('.navbar-link').should('not.contain.text', 'DATA ENTRY');
        });

        it('logout persists after page refresh', () => {
            cy.get('.navbar-button').contains('ACCOUNT').click();
            cy.get('.navbar-dropdown-button').contains('LOG OUT').click();

            cy.wait(500);
            cy.reload();

            cy.get('[data-cy="btn-login"]').should('exist');
            cy.get('.navbar-button').last().should('contain.text', 'LOGIN');
        });
    });

    describe('Account Deletion', () => {
        beforeEach(() => {
            // Create and login with a unique user for deletion tests
            const uniqueEmail = `delete${Date.now()}@test.com`;
            cy.get('[data-cy="btn-login"]').click();
            cy.get('button').last().click();
            cy.get('input[type="email"]').type(uniqueEmail);
            cy.get('input[type="password"]').type('DeleteTest123');
            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').first().click();
            })
            cy.wait(1000);
        });

        it('shows confirmation modal when DELETE ACCOUNT is clicked', () => {
            cy.get('.navbar-button').last().click();
            cy.get('.navbar-dropdown-button').last().click();

            cy.get('.modal-overlay').should('be.visible');
            cy.get('.modal-title').should('contain.text', 'Delete Account');
        });

        it('can cancel account deletion', () => {
            cy.get('.navbar-button').last().click();
            cy.get('.navbar-dropdown-button').last().click();
            cy.get('.modal-content').within(() => {
                cy.get('.btn-secondary').last().click();
            })
            cy.get('.modal-overlay').should('not.exist');
            cy.get('.navbar-button').last().should('contain.text', 'ACCOUNT');
        });

        it('successfully deletes account when confirmed', () => {
            cy.get('.navbar-button').last().click();
            cy.get('.navbar-dropdown-button').last().click();

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').first().click();
            })

            cy.on('window:alert', (text) => {
                expect(text).to.contains('deleted successfully');
            });

            cy.wait(1000);

            cy.get('[data-cy="btn-login"]').should('exist');
            cy.get('.navbar-button').last().should('contain.text', 'LOGIN');
        });

        it('cannot login with deleted account credentials', () => {
            const email = `cannotlogin${Date.now()}@test.com`;
            const password = 'DeleteTest123';

            // First delete the account
            cy.get('.navbar-button').last().click();
            cy.get('.navbar-dropdown-button').last().click();

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').first().click();
            })

            cy.wait(1000);

            // Try to login with deleted credentials
            cy.get('[data-cy="btn-login"]').click();
            cy.get('input[type="email"]').type(email);
            cy.get('input[type="password"]').type(password);

            cy.get('.modal-content').within(() => {
                cy.get('.btn-primary').first().click();
            })

            cy.wait(1000);

            cy.get('.modal-overlay').should('be.visible');
        });
    });
})