/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default () => ({
  elements: {
    sidebar: '.sidebar__-_-_-docusaurus-theme-bootstrap-lib-theme-DocSidebar-',
    pageLink: '.page-link',
    mobileMenuSidebar:
      '.sidebarFAB__-_-_-docusaurus-theme-bootstrap-lib-theme-DocSidebar-',
    mobileSidebar:
      '.sideMenu__-_-_-docusaurus-theme-bootstrap-lib-theme-DocSidebar-',
  },
  mobileViewports: [
    'iphone-4',
    'iphone-5',
    'samsung-s10',
    'iphone-xr',
    'iphone-x',
  ],
  shouldElementBeInMobile(element, predicate) {
    this.mobileViewports.forEach((size) => {
      cy.viewport(size);
      cy.get(element).should(predicate);
    });
  },
  navigate() {
    cy.visit('/docs');
  },
  previousPage() {
    cy.get(this.elements.pageLink).first().click();
  },
  nextPage() {
    cy.get(this.elements.pageLink).last().click();
  },
  isPaginationItemsLengthEqual(expectedLength) {
    cy.get(this.elements.pageLink).should('to.have.length', expectedLength);
  },
});
