import { onFormLayoutsPage } from "../support/page_objects/formsLayoutPage";
import { navigateTo } from "../support/page_objects/navigationPage";
import { onSmartTablePage } from "../support/page_objects/smartTablePage";

describe('Test with page objects', () => {

  beforeEach('open application', () => {
    // cy.visit('/');
    cy.openHomePage();
  });

  it('verify navigations across pages', () => {
    navigateTo.formLayoutsPage();
    navigateTo.datepickerPage();
    navigateTo.smartTablePage();
    navigateTo.toasterPage();
    navigateTo.tooltipPage();
  });

  it.only('should submit inline form and basic form and select tomorrow date in calendar', () => {
    // This test done without page object patter would be too big and
    // Not easily maintainable.
    navigateTo.formLayoutsPage();
    onFormLayoutsPage.submitInlineFormWithNameAndEmail('Artem', 'test@test.com');
    navigateTo.smartTablePage();
    onSmartTablePage.addNewRecordWithFirstAndLastName('Artem', 'Bondar');
    onSmartTablePage.updateAgeByFirstName('Artem', '35');
    onSmartTablePage.deleteRowByIndex(1);

    // ... And so on for the other tests in the firstTest.spec.js
  });


});