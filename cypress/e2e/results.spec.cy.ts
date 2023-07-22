/// <reference types="cypress" />

describe('Results Component', () => {
  it('should render loading page', () => {
    cy.visit(
      '/#/results?destinations=Paris%2CToulouse%2CMontpellier&passengers=2&date=07-22-2023'
    );
    cy.get('[role="loading-pulse"]').should('exist');
  });

  it('should render error if Dijon is present', () => {
    cy.visit(
      '/#/results?destinations=Paris%2CDijon%2CMontpellier&passengers=2&date=07-22-2023'
    );

    cy.contains('Oops! Something went wrong').should(
      'exist'
    );
    cy.get('button:contains("Back")');
  });

  it('should render travel information if no error', () => {
    cy.visit(
      '/#/results?destinations=Paris%2CToulouse%2CMontpellier&passengers=2&date=07-22-2023'
    );
    cy.contains('Paris').should('exist');
    cy.contains('Toulouse').should('exist');
    cy.contains('Montpellier').should('exist');
    cy.contains('783.98 km').should('exist');
    cy.contains('2').should('exist');
    cy.contains('Jul 22, 2023').should('exist');
    cy.get('button:contains("Back")');
  });
});
