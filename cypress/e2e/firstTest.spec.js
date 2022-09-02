/// <reference types="cypress" />

describe('our first suite', () => {
  it('first test', () => {
    // Cypress uses jquery syntax selector, so it's easy if you know that.

    // tell cypress to open the app, then go into forms and form layouts:
    cy.visit('/');
    cy.contains('Forms').click(); // contains() searches for an element that contains given text
    cy.contains('Form Layouts').click(); // click() triggers a click event on the element

    // locator by tag name
    cy.get('input');

    // locator by id
    cy.get('#inputEmail1');

    // locator by class name
    cy.get('.input-full-width');

    // locator by attribute name
    cy.get('[placeholder]');

    // locator by attribute name and value
    cy.get('[placeholder="Email"]');

    // locator by class value
    cy.get('[class="input-full-width size-medium shape-rectangle"]');

    // locator by tag name and attribute with value
    cy.get('input[placeholder="Email"]');

    // locator by two different attributes
    cy.get('[placeholder="Email"][type="email"]');

    // locator by tag name, attribute with value, id and class name
    cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

    // The most recommended way by cypress --> create your own attributes
    cy.get('[data-cy="imputEmail1"]');
  });

  it('second test', () => {
    cy.visit('/');
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();

    cy.get('[data-cy="signInButton"');

    cy.contains('Sign in'); // Check on the DOM for exact text

    cy.contains('[status="warning"]', 'Sign in');

    // After we find an element, we can travel to the parent element
    // to find other elements/attributes using the .parents()
    cy.get('#inputEmail3')
      .parents('form')
      .find('button')
      .should('contain', 'Sign in')
      .parents('form')
      .find('nb-checkbox')
      .click();

    // find and nb-card element with text "Horizontal form"
    // within that elementy (children), find an element with attribute type="email"
    cy.contains('nb-card', 'Horizontal form').find('[type="email"]');
  });

  it('then and wrap methods', () => {
    cy.visit('/');
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();

    // find the card with what we knoe (no re-use)
    cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email');
    cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password');
    cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should('contain', 'Email');
    cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain', 'Password');

    // If we wanted to make it re-usable, the follwing code will not work
    /*
    const firstForm = cy.contains('nb-card', 'Using the Grid')
    firstForm.find('[for="inputEmail1"]').should('contain', 'Email')
    firstForm.find('[for="inputPassword2"]').should('contain', 'Password')
    */

    // The reason is that cypress is async. To make it work, we use the follwing syntax
    cy.contains('nb-card', 'Using the Grid').then(firstForm => {
      // important: here, firstForm is a jquery element (HTML), so we need to use jquery
      // html syntax to assert the attributes, also use expect() to assert
      const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text();
      const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text();
      expect(emailLabelFirst).to.equal('Email');
      expect(passwordLabelFirst).to.equal('Password');

      // we can also create nested .then() to re-use previous results:
      cy.contains('nb-card', 'Basic form').then(secondForm => {
        const passwordSecondText = secondForm.find('[for="exampleInputPassword1"]').text();
        expect(passwordLabelFirst).to.equal(passwordSecondText);

        // To switch back from jquery to cypress syntax, we can "wrap" it using the .wrap() method
        cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password');
      });
    });
  });

  it('invoke command', () => {
    cy.visit('/');
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();

    // 1. with a get, assert with .should
    // 2. with a get, use then to convert to jquery and assert with expect()
    // 3. with a get, use invoke to call a function of the element, for example text()
    cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
      expect(text).to.equal('Email address');
    });

    cy.contains('nb-card', 'Basic form')
      .find('nb-checkbox')
      .click()
      .find('.custom-checkbox')
      .invoke('attr', 'class')
      // .should('contain', 'checked');
      .then(classValue => {
        expect(classValue).to.contain('checked');
      });

    // different types of assertions:
    cy.get('[for="exampleInputEmail1"]')
      .should('contain', 'Email address')
      .should('have.class', 'label')
      .and('have.text', 'Email address');
  });

  it('assert property and date picker', () => {
    const selectDayFromCurrent = (day) => {
      // This is a recursive function that loops through months until it finds the desired month
      const date = new Date();
      date.setDate(date.getDate() + day);
      const futureDay = date.getDate();
      const futureMonth = date.toLocaleString('default', { month: 'short' });
      const dateAssert = `${futureMonth} ${futureDay}, ${date.getFullYear()}`;
      cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
        if (!dateAttribute.includes(futureMonth)) {
          cy.get('[data-name="chevron-right"]').click();
          selectDayFromCurrent(day);
        } else {
          cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click();
        }
      });

      return dateAssert;
    };

    cy.visit('/');
    cy.contains('Forms').click();
    cy.contains('Datepicker').click();

    cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
      cy.wrap(input).click();
      const dateAssert = selectDayFromCurrent(300);
      cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert);
    });

  });

  it('radio button', () => {
    cy.visit('/');
    cy.contains('Forms').click();
    cy.contains('Form Layouts').click();

    cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
      cy.wrap(radioButtons)
        .first() // same as using .eq(0)
        // check is cypress helper to check or uncheck a radio button or checkbox
        // We have to pass the force: true flag to cypress because the input is actually hidden
        // So with the flag we tell cypress to check it even if it's not visible
        .check({ force: true })
        .should('be.checked');

      cy.wrap(radioButtons)
        .eq(1)
        .check({ force: true });

      cy.wrap(radioButtons)
        .eq(0) // same as using .first()
        .should('not.be.checked');

      cy.wrap(radioButtons)
        .eq(2)
        .should('be.disabled');
    });
  });

  it('checkboxes', () => {
    cy.visit('/');
    cy.contains('Modal & Overlays').click();
    cy.contains('Toastr').click();

    cy.get('[type="checkbox"]').check({ force: true });
    cy.get('[type="checkbox"]').eq(0).click({ force: true });
    cy.get('[type="checkbox"]').eq(1).click({ force: true });
  });

  it('lists and dropdowns', () => {
    cy.visit('/');

    // "theme" dropdown
    cy.get('nav nb-select').click();

    // check that after clicking on "Dark" option, the background changes to the dark theme color
    cy.get('.options-list').contains('Dark').click();
    cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)');


    // check that for every dropdown option the background changes to the selected theme
    cy.get('nav nb-select').then(dropdown => {
      const wrapped = cy.wrap(dropdown);
      cy.wrap(dropdown).click();
      cy.get('.options-list nb-option').each((listItem, index) => {
        const itemText = listItem.text().trim(); // Note that text have a whitespace at the beginning, that's the reason for the trim
        cy.wrap(listItem).click();
        cy.wrap(dropdown).should('contain', itemText);
        const colors = {
          Light: 'rgb(255, 255, 255)',
          Dark: 'rgb(34, 43, 69)',
          Cosmic: 'rgb(50, 50, 89)',
          Corporate: 'rgb(255, 255, 255)',
        };
        cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText]);
        if (index < 3) cy.wrap(dropdown).click(); // don't leave the dropdown open after the last theme assert
      });
    });

  });


  it('web tables', () => {
    cy.visit('/');
    cy.contains('Tables & Data').click();
    cy.contains('Smart Table').click();

    // Edit a row's age
    cy.get('tbody').contains('tr', 'Larry').then(tableRow => {
      cy.wrap(tableRow).find('.nb-edit').click();
      cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25');
      cy.wrap(tableRow).find('.nb-checkmark').click();
      cy.wrap(tableRow).find('td').eq(6).should('contain', 25);
    });

    // add a new element
    cy.get('thead').find('.nb-plus').click();
    cy.get('thead').find('tr').eq(2).then(tableRow => {
      cy.wrap(tableRow).find('[placeholder="First Name"]').type('Artem');
      cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Bondar');
      cy.wrap(tableRow).find('.nb-checkmark').click();
    });
    cy.get('tbody tr').first().find('td').then(tableColumns => {
      cy.wrap(tableColumns).eq(2).should('contain', 'Artem');
      cy.wrap(tableColumns).eq(3).should('contain', 'Bondar');
    });

    // assert that we can filter in the header box by age number
    const age = [20, 30, 40, 200];
    cy.wrap(age).each(age => {
      cy.get('thead [placeholder="Age"]').clear().type(age);
      cy.wait(500); // This is a wait time to allow the DOM to be ordered (without this, cypress asserts the rest but the DOM hasn't filtered)
      cy.get('tbody tr').each(tableRow => {
        if (age === 200) {
          // No data should be displayed
          cy.wrap(tableRow).should('contain', 'No data found');
        } else {
          cy.wrap(tableRow).find('td').eq(6).should('contain', age);
        }
      });

    });
  });

  it('tooltips', () => {
    cy.visit('/');
    cy.contains('Modal & Overlays').click();
    cy.contains('Tooltip').click();

    // We first trigger a click event to see in cypress steps the tooltip and grab
    // the selector from there
    cy.contains('nb-card', 'Colored Tooltips').contains('Default').click();
    cy.get('nb-tooltip').should('contain', 'This is a tooltip');
  });

  it.only('dialog box', () => {
    cy.visit('/');
    cy.contains('Tables & Data').click();
    cy.contains('Smart Table').click();

    // Assert the browser dialog window (outside of the DOM)
    const stub = cy.stub();
    cy.on('window:confirm', stub);
    cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
      expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?');
    });

    // To assert a "cancel" click in the browser dialog window, return false:
    cy.get('tbody tr').first().find('.nb-trash').click();
    cy.on('window:confirm', () => false);

  });
});
