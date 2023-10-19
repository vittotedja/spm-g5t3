describe('Staff who has not applied to any roles', () => {
	it('Logging in and viewing Role Details', () => {
		cy.visit('/', {failOnStatusCode: false});

		cy.contains('GlassWindow');

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
	});

	it('Applying to a role', () => {});
});
