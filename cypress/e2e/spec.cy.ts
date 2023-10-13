describe('Manager logs in to app for the first time', () => {
	it('Connecting to home page for the first time', () => {
		cy.visit('localhost:5173/login');

		cy.contains('GlassWindow');

		cy.get('[data-testid = email]').type('Eric.Loh@allinone.com.sg');
		cy.get('[data-testid = password]').type('Eric.Loh');
		cy.get('[data-testid = submitBtn]').click();

		cy.url().should('include', '/role-listing');
		cy.contains('Eric Loh');

		cy.contains('Manager');
	});
});

describe('Staff logs in to app for the first time', () => {
	it('Connecting to home page for the first time', () => {
		cy.visit('localhost:5173/login');

		cy.contains('GlassWindow');

		cy.get('[data-testid = email]').type('Oliver.Tan@allinone.com.sg');
		cy.get('[data-testid = password]').type('Oliver.Tan');
		cy.get('[data-testid = submitBtn]').click();

		cy.url().should('include', '/role-listing');
		cy.contains('Oliver Tan');
	});
});
