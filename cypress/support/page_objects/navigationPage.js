export class NavigationPage {

  // 
  selectGroupMenuItem (groupName) {
    cy.contains('a', groupName).then(menu => {
      cy.wrap(menu).find('.expand-state g g').invoke('attr', 'data-name').then(attr => {
        if (attr.includes('left')) {
          cy.wrap(menu).click();
        }
      });
    });
  }

  formLayoutsPage () {
    this.selectGroupMenuItem('Form');
    cy.contains('Form Layouts').click();
  }

  datepickerPage () {
    this.selectGroupMenuItem('Form');
    cy.contains('Datepicker').click();
  }

  toasterPage () {
    this.selectGroupMenuItem('Modal & Overlays');
    cy.contains('Toastr').click();
  }

  smartTablePage () {
    this.selectGroupMenuItem('Tables & Data');
    cy.contains('Smart Table').click();
  }

  tooltipPage () {
    this.selectGroupMenuItem('Modal & Overlays');
    cy.contains('Tooltip').click();
  }
}

export const navigateTo = new NavigationPage();
