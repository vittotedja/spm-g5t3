describe('HR workflow', () => {
	it('should allow HR to see all posted role listings', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Arifin Saputra is an HR
		cy.get('[data-testid = email]').type('arifin.saputra@allinone.com.sg');
		cy.get('[data-testid = password]').type('arifin.saputra');
		cy.get('[data-testid = submitBtn]').click();

		cy.contains('Arifin Saputra');

		cy.get('[data-testid=manager-link]').click();
		cy.contains('All Posted Role Listings');
		cy.contains('Add New Listing');

		cy.get('#add-new-listing').click();

		cy.contains('New Role Listing');
		//loads all data first
		cy.wait(6000);

		//shows error message if no data is entered
		cy.get('#save-listing').click();
		cy.contains('Please select at least one hiring manager');

		//choose the role name
		cy.get('.css-1xc3v61-indicatorContainer').first().click();
		cy.get('#react-select-3-listbox').type('{downarrow}{enter}');
		cy.get('#save-listing').click();
		cy.contains('Please select at least one hiring manager');

		// choose date
		cy.get('[data-testid=datepicker]').click();

		const today = new Date();
		const date = today.getDate();
		cy.contains('button', date + 2)
			.click()
			.type('{esc}');
		cy.get('#save-listing').click();
		cy.contains('Please select at least one hiring manager');

		// choose the location
		cy.get('.css-1xc3v61-indicatorContainer').eq(1).click();
		cy.get('#react-select-5-listbox').type('{downarrow}{enter}');
		cy.get('#save-listing').click();
		cy.contains('Please select at least one hiring manager');

		// choose a hiring manager
		cy.get('.css-1xc3v61-indicatorContainer').last().click();
		cy.get('#react-select-7-listbox').type(
			'{downarrow}{enter}{downarrow}{downarrow}{enter}'
		);
	});
});
