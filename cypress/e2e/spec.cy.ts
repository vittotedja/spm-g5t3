describe('Manager logs in to app for the first time', () => {
	it('Connecting to home page for the first time', () => {
		cy.visit('localhost:5173/login');

		cy.contains('GlassWindow');

		cy.get('[data-testid = email]').type('James.Tong@allinone.com.sg');
		cy.get('[data-testid = password]').type('James.Tong');
		cy.get('[data-testid = submitBtn]').click();

		cy.url().should('include', '/role-listing');
		cy.contains('James Tong');

		cy.visit('/manager');
		cy.contains('Posted Role Listing');
	});
});

// describe('Staff logs in to app for the first time', () => {
// 	it('Connecting to home page for the first time', () => {
// 		cy.visit('localhost:5173/login');

// 		cy.contains('GlassWindow');

// 		cy.get('[data-testid = email]').type('Oliver.Tan@allinone.com.sg');
// 		cy.get('[data-testid = password]').type('Oliver.Tan');
// 		cy.get('[data-testid = submitBtn]').click();

// 		cy.url().should('include', '/role-listing');
// 		cy.contains('Oliver Tan');
// 	});
// });
