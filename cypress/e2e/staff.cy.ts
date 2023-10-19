describe('Staff workflow', () => {
	it('Logging in and viewing Role Details', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Logan Tan has no job applications
		cy.get('[data-testid = email]').type('logan.tan@allinone.com.sg');
		cy.get('[data-testid = password]').type('logan.tan');
		cy.get('[data-testid = submitBtn]').click();

		cy.contains('Logan Tan');
		let clickedRoleName = '';
		cy.get('[data-testid = role-name]', {timeout: 10000})
			.first()
			.then(($roleName) => {
				clickedRoleName = $roleName.text();
			});

		cy.get('[data-testid = role-card]', {timeout: 10000}).first().click();
		cy.get('[data-testid=role-details-name]', {timeout: 10000}).should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedRoleName);
			}
		);

		//goes to profile
		cy.get('[data-testid=current-user]').click();

		//No job applications
		cy.contains('Go to Role Listing');
	});

	it('Applying for a role', () => {
		cy.visit('/', {failOnStatusCode: false});

		cy.contains('GlassWindow');

		cy.get('[data-testid = email]').type('susan.goh@allinone.com.sg');
		cy.get('[data-testid = password]').type('susan.goh');
		cy.get('[data-testid = submitBtn]').click();

		//Susan Goh has and will apply for more jobs
		cy.contains('Susan Goh');

		// opens role details
		let clickedRoleName = '';
		cy.get('[data-testid = role-name]', {timeout: 10000})
			.first()
			.then(($roleName) => {
				clickedRoleName = $roleName.text();
			});

		cy.get('[data-testid = role-card]', {timeout: 10000}).first().click();
		cy.get('[data-testid=role-details-name]', {timeout: 10000}).should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedRoleName);
			}
		);

		//goes through the steps of applying for a role
		cy.get('#apply-button').click();
		cy.get('[data-testid = reason-input]').type(
			'I am interested in this role'
		);
		cy.get('#submit-button').click();
		cy.get('#confirm-button').click();
		cy.contains('You have successfully Applied to the Role');
		cy.get('[data-testid=close-button]').last().click();

		// applies for the same role again -- should show Failure message
		cy.get('#apply-button').click();
		cy.contains('You Have Applied to this Role');
		cy.get('[data-testid=close-button]').first().click();

		// goes to Profile
		cy.get('[data-testid=current-user]').click();
		//expects the applied role to show up
		cy.get('[data-testid=profile-rolename]', {timeout: 10000}).should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.include(clickedRoleName);
			}
		);

		// checks if homepage has no more role that a user has just applied
		cy.get('[data-testid=home-link]').click();
		cy.get('[data-testid=role-details-name]', {timeout: 10000}).should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).not.to.eq(clickedRoleName);
			}
		);
	});
});
