describe('Manager workflow', () => {
	it('should allow manager to view their posted roles, accept and reject users', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Chandra Pandey is a manager who has job listings
		cy.get('[data-testid = email]').type('chandra.pandey@allinone.com.sg');
		cy.get('[data-testid = password]').type('chandra.pandey');
		cy.get('[data-testid = submitBtn]').click();

		cy.contains('Chandra Pandey');

		cy.get('[data-testid=manager-link]').click();
		cy.contains('All Posted Role Listings');

		//TODO: fetch from backend
		let clickedRoleName = '';
		cy.get('[data-testid=rolename-manager]')
			.first()
			.then(($roleName) => {
				clickedRoleName = $roleName.text();
			});
		cy.get('[data-testid=manager-individual-role]').first().click();
		cy.get('[data-testid=applicantslist-rolename]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedRoleName);
			}
		);
		// click on first applicant
		// TODO: set up staff to apply first
		// TODO: give conditional check in case no applicants
		let clickedApplicantsName = '';
		cy.get('[data-testid=applicants-name]')
			.first()
			.then(($roleName) => {
				clickedApplicantsName = $roleName.text();
			});

		cy.get('[data-testid=applicant-row]').then(($applicantRows) => {
			if ($applicantRows.length > 0) {
				cy.get('[data-testid=applicants-name]').click();
			} else {
				cy.contains('No Applied Applicants Yet');
			}
		});
		//check for any more details of the applicant here

		cy.get('[data-testid=applicant-details-name]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedApplicantsName);
			}
		);
		cy.get('#shortlist-button');
		cy.get('#reject-button').click();
		cy.contains('Rejected');
		cy.get('[data-testid=back-to-applicants-list]').click();

		//if applicant-row exist then check if the applicant name is not the same as the one clicked else check if no applicants yet
		cy.get('[data-testid=applicant-row]').then(($applicantRows) => {
			if ($applicantRows.length > 0) {
				cy.get('[data-testid=applicants-name]').should(
					($applicantName) => {
						expect($applicantName.text()).to.not.eq(
							clickedApplicantsName
						);
					}
				);
			} else {
				cy.contains('No Applied Applicants Yet');
			}
		});

		//check for shortlisted applicants
		cy.get('[data-testid=shortlisted-button]').click();

		let clickedShortlistedName = '';
		cy.get('[data-testid=applicants-name]')
			.first()
			.then(($roleName) => {
				clickedShortlistedName = $roleName.text();
			});
		cy.get('[data-testid=applicant-row]').then(($applicantRows) => {
			if ($applicantRows.length > 0) {
				cy.get('[data-testid=applicants-name]').click();
			} else {
				cy.contains('No Applied Applicants Yet');
			}
		});

		cy.get('[data-testid=applicant-details-name]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedShortlistedName);
			}
		);
		cy.contains('Shortlisted');

		// TODO: reset DB
	});
});
