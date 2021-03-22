/// <reference types="cypress" />
import { createVisualTests } from '../../support/utils/visualTesting';

describe('Date-picker visual tests', { scrollBehavior: 'center' }, () => {
  const pageId = 'forms-date-picker--default-story';
  const stories = ['story--forms-date-picker--default-story', 'story--forms-date-picker--initial'];

  before(() => {
    cy.visitStorybookIframe(pageId);
    cy.verifyAllStoriesHaveVRT(stories);

    const fixateToday = selector => {
      cy.get(selector).then(picker => {
        picker[0].value = new Date(1972, 1, 18);
      });
    };
    fixateToday(`#story--forms-date-picker--initial [data-test='initial-today']`);
    fixateToday(`#story--forms-date-picker--default-story sb-zen-date-picker`);
  });

  const skippedStories = [];
  createVisualTests(stories, skippedStories, 'sb-zen-date-picker');

  const story = 'story--forms-date-picker--default-story';
  it('Verifies opened datepicker in ' + `${story}`, () => {
    const datepicker = `#${story} sb-zen-date-picker`;
    cy.get(datepicker).then(() => {
      cy.get(datepicker).click();

      // field screenshot:
      cy.get(datepicker)
        .shadow()
        .find('sb-zen-popover')
        .shadow()
        .find('.popup-wrap')
        .should('be.visible')
        .wait(300) // transition
        .matchImageSnapshot();

      // menu screenshot:
      cy.get(datepicker).should('be.visible').matchImageSnapshot(`field-${story}`);
    });
  });
});