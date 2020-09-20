/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default () => ({
  elements: {
    pagination: '.page-link',
  },
  navigate(url = '/blog') {
    cy.visit(url);
  },
  previousPage() {
    cy.get(this.elements.pagination).first().click();
  },
  nextPage() {
    cy.get(this.elements.pagination).last().click();
  },
  isPaginationItemsLengthEqual(expectedLength) {
    cy.get(this.elements.pagination).should('to.have.length', expectedLength);
  },
});
