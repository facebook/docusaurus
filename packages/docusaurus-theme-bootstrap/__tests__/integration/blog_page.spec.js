/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import blogPageFactory from '../support/blog_page.js';

describe('Blog Page', () => {
  const BlogPage = blogPageFactory();

  beforeEach(() => {
    BlogPage.navigate();
  });

  context('Blog Pagination', () => {
    it('Pagination', () => {
      BlogPage.navigate('/blog/2020/04/14/blog-plugin');
      BlogPage.isPaginationItemsLengthEqual(1);
      cy.url().should('include', '/blog-plugin');

      BlogPage.nextPage();
      cy.url().should('include', '/large-blog-post');
      BlogPage.isPaginationItemsLengthEqual(2);

      BlogPage.nextPage();
      cy.url().should('include', '/welcome');
      BlogPage.isPaginationItemsLengthEqual(2);

      BlogPage.nextPage();
      cy.url().should('include', '/hello-world');
      BlogPage.isPaginationItemsLengthEqual(2);

      BlogPage.nextPage();
      cy.url().should('include', '/hola');
      BlogPage.isPaginationItemsLengthEqual(1);

      BlogPage.previousPage();
      cy.url().should('include', '/hello-world');

      BlogPage.previousPage();
      cy.url().should('include', '/welcome');

      BlogPage.previousPage();
      cy.url().should('include', '/large-blog-post');

      BlogPage.previousPage();
      cy.url().should('include', '/blog-plugin');
    });
  });
});
