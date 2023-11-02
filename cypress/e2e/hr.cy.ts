describe('HR workflow', () => {
	it('should allow HR to see all posted role listings and add more', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Arifin Saputra is an HR
		cy.get('[data-testid = email]').type('arifin.saputra@allinone.com.sg');
		cy.get('[data-testid = password]').type('arifin.saputra');
		cy.get('[data-testid = submitBtn]').click();

		cy.wait(6000);

		cy.contains('Arifin Saputra');

		cy.get('[data-testid=manager-link]').click();
		cy.contains('All Posted Role Listings');
		cy.contains('Add New Listing');

		let noOfListings;
		cy.get('[data-testid=manager-individual-role]')
			.its('length')
			.then((length) => {
				cy.log(length.toString());
				noOfListings = length;
			});

		cy.get('#add-new-listing').click();

		cy.contains('New Role Listing');
		//loads all data first
		cy.wait(6000);

		//shows error message if no data is entered
		cy.get('#save-listing').click();
		cy.contains(
			'Something went wrong, please check whether you have keyed in the right details'
		);

		//choose the role name
		cy.get('.css-1xc3v61-indicatorContainer').first().click();
		cy.get('#react-select-3-listbox').type('{downarrow}{enter}');
		cy.get('#save-listing').click();
		cy.contains(
			'Something went wrong, please check whether you have keyed in the right details'
		);

		// choose date
		cy.get('[data-testid=datepicker]').click();

		const today = new Date();
		const date = today.getDate();
		const month = today.getMonth();
		if (month === 1 && date > 28) {
			cy.contains('button', 2).click().type('{esc}');
		} else if (date >= 30) {
			cy.contains('button', 1).click().type('{esc}');
		} else {
			cy.contains('button', date + 2)
				.click()
				.type('{esc}');
		}
		cy.get('#save-listing').click();
		cy.contains(
			'Something went wrong, please check whether you have keyed in the right details'
		);

		// choose the location
		cy.get('.css-1xc3v61-indicatorContainer').eq(1).click();
		cy.get('#react-select-5-listbox').type('{downarrow}{enter}');
		cy.get('#save-listing').click();
		cy.contains(
			'Something went wrong, please check whether you have keyed in the right details'
		);

		// choose vacancy
		cy.get('[data-testid=vacancy]')
			.type('this is not a number')
			.should('not.have.value', 'this is not a number');

		cy.get('[data-testid=vacancy]').type('2').should('have.value', '2');

		// choose a hiring manager
		cy.get('.css-1xc3v61-indicatorContainer').last().click();
		cy.get('#react-select-7-listbox').type(
			'{downarrow}{enter}{downarrow}{downarrow}{enter}'
		);

		// all checks passed, save listing
		cy.get('#save-listing').click();
		cy.contains('Role Listing posted successfully');
		cy.url().should('include', '/manager');

		cy.get('[data-testid=manager-individual-role]')
			.its('length')
			.then((length) => {
				expect(length).to.eq(noOfListings + 1);
			});
	});
});
