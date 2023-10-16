describe('Staff logs in to app for the first time', () => {
	it('Connecting to home page for the first time', () => {
		cy.visit('localhost:5173');

		cy.contains('GlassWindow');

		cy.get('[data-testid = email]').type('James.Tong@allinone.com.sg');
		cy.get('[data-testid = password]').type('James.Tong');
		cy.get('[data-testid = submitBtn]').click();

		cy.contains('James Tong');
		// cy.wait(4000);
		cy.get('[data-testid = role-card]', {timeout: 10000}).first().click();
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
