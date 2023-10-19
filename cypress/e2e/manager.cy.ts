describe('Manager workflow', () => {
	it('Logging in and viewing manager page', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Logan Tan has no job applications
		cy.get('[data-testid = email]').type('chandra.pandey@allinone.com.sg');
		cy.get('[data-testid = password]').type('chandra.pandey');
		cy.get('[data-testid = submitBtn]').click();

		cy.contains('Chandra Pandey');
	});
});
