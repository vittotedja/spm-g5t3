describe('Staff workflow', () => {
	it('should allow staff to view open role listings', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Logan Tan has no job applications
		cy.get('[data-testid = email]').type('logan.tan@allinone.com.sg');
		cy.get('[data-testid = password]').type('Logan.Tan');
		cy.get('[data-testid = submitBtn]').click();

		cy.wait(6000);
		cy.contains('Logan Tan');
		let clickedRoleName = '';
		cy.get('[data-testid = role-name]')
			.first()
			.then(($roleName) => {
				clickedRoleName = $roleName.text();
			});

		cy.get('[data-testid = role-card]').first().click();
		cy.get('[data-testid=role-details-name]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.eq(clickedRoleName);
			}
		);

		//goes to profile
		cy.get('[data-testid=current-user]').click();

		//No job applications
		cy.contains('Go to Role Listing');
		cy.get('[data-testid=logout-button]').click();
	});

	it('should allow staff to be able to apply and withdraw for roles', () => {
		cy.visit('/', {failOnStatusCode: false});
		cy.contains('Please login to access this page');
		cy.contains('GlassWindow');

		// Logan Tan has no job applications
		cy.get('[data-testid = email]').type('bao.nguyen@allinone.com.sg');
		cy.get('[data-testid = password]').type('Bao.Nguyen');
		cy.get('[data-testid = submitBtn]').click();

		cy.wait(6000);
		cy.contains('Bao Nguyen');
		let clickedRoleName = '';
		cy.get('[data-testid = role-name]')
			.first()
			.then(($roleName) => {
				clickedRoleName = $roleName.text();
			});

		cy.get('[data-testid = role-card]').first().click();
		cy.get('[data-testid=role-details-name]').should(
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
		cy.get('[data-testid=close-button]').eq(4).click();

		// user is redirected to profile page
		cy.wait(6000);
		cy.get('[data-testid=profile-rolename]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).to.include(clickedRoleName);
			}
		);

		cy.get('[data-testid=profile-rolename]').each(
			($roleDetailsName) => {
				if ($roleDetailsName.text() == clickedRoleName) {
					cy.get('[data-testid=profile-rolename]')
						.contains(clickedRoleName)
						.click();
				}
			}
		);

		// applies for the same role again -- should show Failure message
		cy.contains('Withdraw Application').click();
		cy.get('[data-testid=modal]')
			.eq(5)
			.get('#confirm-button')
			.click({force: true});
		cy.contains('You have successfully withdrawn your application');
		cy.get('[data-testid=close-button]').last().click();

		// Make sure listing card exist
		cy.get('body').should('contain', 'Call Centre')

		// loop through all the listing cards in the profile page
		cy.get('[data-testid=profile-rolename]').each(
			($roleDetailsName) => {
				if ($roleDetailsName.text() == clickedRoleName) {
					//expect to be withdrawn
					cy.get('[data-testid=profile-rolename]')
						.contains(clickedRoleName)
						.click();
					return false;
				}
			}
		);

		cy.get('#apply-button').should('be.disabled');

		// checks if homepage has no more role that a user has just applied
		cy.get('[data-testid=home-link]').click();
		cy.get('[data-testid=role-details-name]').should(
			($roleDetailsName) => {
				expect($roleDetailsName.text()).not.to.eq(clickedRoleName);
			}
		);
	});

	it('should allow staff to only apply max of 5 jobs', () => {
		cy.visit('/', {failOnStatusCode: false});

		cy.get('[data-testid = email]').type('daniel.fu@allinone.com.sg');
		cy.get('[data-testid = password]').type('Daniel.Fu');
		cy.get('[data-testid = submitBtn]').click();

		cy.wait(6000);
		//checking that data is properly fetched
		cy.contains('Daniel Fu');

		//applies for 5 jobs
		let i: number;
		for (i = 0; i < 5; i++) {
			cy.get('[data-testid = role-card]')
				.first()
				.click();
			cy.get('#apply-button').click();
			cy.get('[data-testid = reason-input]').type(
				'I am interested in this role ' + (i + 1) + ' application'
			);
			cy.get('#submit-button').click();
			cy.get('#confirm-button').click();
			cy.contains('You have successfully Applied to the Role');
			cy.get('[data-testid=close-button]').eq(4).click();
			cy.get('[data-testid=home-link]').click();
		}

		//should not be able to apply for the 6th role
		cy.get('[data-testid = role-card]').first().click();
		cy.get('#apply-button').click();
		cy.contains('You Have Reached the Maximum Applications Limit');
	});
});
