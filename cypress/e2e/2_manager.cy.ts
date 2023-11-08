describe('Manager workflow', () => {
	it('should allow manager to view their posted roles, accept and reject users', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Chandra Pandey is a manager who has job listings
		cy.get('[data-testid = email]').type('chandra.pandey@allinone.com.sg');
		cy.get('[data-testid = password]').type('Chandra.Pandey');
		cy.get('[data-testid = submitBtn]').click();

		cy.wait(6000);

		cy.contains('Chandra Pandey');

		cy.get('[data-testid=manager-link]').click();
		cy.contains('Your Posted Role Listings');

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
		let clickedApplicantsName = '';
		cy.get('[data-testid=applicants-name]')
			.first()
			.then(($roleName) => {
				clickedApplicantsName = $roleName.text();
			})
			.click();

		cy.get('[data-testid=applicant-details-name]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedApplicantsName);
			}
		);
		cy.get('#shortlist-button');
		cy.get('#reject-button').click();
		cy.contains('Rejected');
		cy.get('[data-testid=back-to-applicants-list]').click();

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

		// to change to siti abdullah
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
	});
	it("should allow manager to see that they haven't posted any roles", () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Yee Lim is a manager who has no job listings
		cy.get('[data-testid = email]').type('yee.lim@allinone.com.sg');
		cy.get('[data-testid = password]').type('Yee.Lim');
		cy.get('[data-testid = submitBtn]').click();

		cy.wait(6000);

		cy.contains('Yee Lim');

		cy.get('[data-testid=manager-link]').click();
		cy.contains('You have no open Role Listing');

		// let clickedRoleName = '';
		// cy.get('[data-testid=rolename-manager]')
		// 	.first()
		// 	.then(($roleName) => {
		// 		clickedRoleName = $roleName.text();
		// 	});
		// cy.get('[data-testid=manager-individual-role]').first().click();
		// cy.get('[data-testid=applicantslist-rolename]').should(
		// 	($roleDetailsName) => {
		// 		expect($roleDetailsName.text()).to.eq(clickedRoleName);
		// 	}
		// );
		// cy.contains('No Applicants Yet');
	});
	it('should allow manager to view their posted roles that has no applicants yet', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Yee Lim is a manager who has no job listings
		cy.get('[data-testid = email]').type('siti.abdullah@allinone.com.sg');
		cy.get('[data-testid = password]').type('Siti.Abdullah');
		cy.get('[data-testid = submitBtn]').click();

		cy.wait(6000);

		cy.contains('Siti Abdullah');

		cy.get('[data-testid=manager-link]').click();

		let clickedRoleName = '';
		cy.get('[data-testid=rolename-manager]')
			.last()
			.then(($roleName) => {
				clickedRoleName = $roleName.text();
			});
		cy.get('[data-testid=manager-individual-role]').last().click();
		cy.get('[data-testid=applicantslist-rolename]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedRoleName);
			}
		);
		cy.contains('No Applicants Yet');
	});
});
