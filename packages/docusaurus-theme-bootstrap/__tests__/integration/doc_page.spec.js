/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import docPageFactory from '../support/doc_page.js';

describe('Doc Page', () => {
  const DocPage = docPageFactory();

  beforeEach(() => {
    DocPage.navigate();
  });

  afterEach(() => {
    it('Pagination', () => {
      DocPage.isPaginationItemsLengthEqual(1);

      DocPage.nextPage();
      cy.url().should('include', '/doc2');
      DocPage.isPaginationItemsLengthEqual(2);

      DocPage.nextPage();
      cy.url().should('include', '/doc3');
      DocPage.isPaginationItemsLengthEqual(2);

      DocPage.nextPage();
      cy.url().should('include', '/mdx');
      DocPage.isPaginationItemsLengthEqual(1);

      DocPage.previousPage();
      cy.url().should('include', '/doc3');

      DocPage.previousPage();
      cy.url().should('include', '/doc2');

      DocPage.previousPage();
      cy.url().should('include', '/doc');
    });
  });

  context('Large devices resolutions', () => {
    it('Sidebar', () => {
      cy.get(DocPage.elements.sidebar).should('be.visible');
    });
  });

  context('Small devices resolutions', () => {
    it('Sidebar', () => {
      DocPage.shouldElementBeInMobile(
        DocPage.elements.mobileSidebar,
        'not.be.visible',
      );
      cy.get(DocPage.elements.mobileMenuSidebar).click();
      DocPage.shouldElementBeInMobile(
        DocPage.elements.mobileSidebar,
        'be.visible',
      );
    });
  });
});
