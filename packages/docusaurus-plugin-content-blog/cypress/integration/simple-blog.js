/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('simple blog', () => {
  before(() => {
    const port = Cypress.env('PORT');
    Cypress.config('baseUrl', `http://localhost:${port}/blog`);
  });

  describe('home page', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    describe('seventh item in page', () => {
      it('has title "date-matter"', () => {
        cy.get('[itemprop=blogPost] [itemprop=headline]')
          .eq(6)
          .should('have.text', 'date-matter');
      });

      it('click on title send to correct page', () => {
        cy.get('[itemprop=blogPost] [itemprop=headline]').eq(6).click();
        cy.url().should('eq', `${Cypress.config('baseUrl')}/date-matter`);
      });
    });

    describe('first item in sidebar', () => {
      it('has title "MDX Blog Sample with require calls"', () => {
        cy.get('[aria-label="Blog recent posts navigation"] a')
          .eq(0)
          .should('have.text', 'MDX Blog Sample with require calls');
      });

      it('click on item send to correct page', () => {
        cy.get('[aria-label="Blog recent posts navigation"] a').eq(0).click();
        cy.url().should(
          'eq',
          `${Cypress.config('baseUrl')}/mdx-require-blog-post`,
        );
      });
    });
  });

  describe('date matter', () => {
    beforeEach(() => {
      cy.visit('/date-matter');
    });

    it('title is correct', () => {
      cy.get('[itemprop=headline]').should('have.text', 'date-matter');
    });

    it('date is correct', () => {
      cy.get('[itemprop=datePublished]').should('have.text', 'January 1, 2019');
    });

    it('content is correct', () => {
      cy.get('[itemprop=articleBody]').should(
        'have.text',
        'date inside front matter',
      );
    });

    it('title of newer post is correct', () => {
      cy.get('[aria-label="Blog post page navigation"]')
        .contains('Newer Post')
        .contains('some heading');
    });

    it('link to newer post send to "some heading"', () => {
      cy.get('[aria-label="Blog post page navigation"]')
        .contains('Newer Post')
        .click();
      cy.url().should('eq', `${Cypress.config('baseUrl')}/heading-as-title`);
    });

    it('link to older post send to "Happy 1st Birthday Slash!"', () => {
      cy.get('[aria-label="Blog post page navigation"]')
        .contains('Older Post')
        .click();
      cy.url().should(
        'eq',
        `${Cypress.config('baseUrl')}/2018/12/14/Happy-First-Birthday-Slash`,
      );
    });
  });

  describe('MDX Blog Sample with require calls', () => {
    it("doesn't have link to newer post", () => {
      cy.visit('/mdx-require-blog-post');
      cy.get('[aria-label="Blog post page navigation"]')
        .contains('Newer Post')
        .should('not.exist');
    });
  });

  describe('Happy 1st Birthday Slash!', () => {
    it("doesn't have link to older post", () => {
      cy.visit('/2018/12/14/Happy-First-Birthday-Slash');
      cy.get('[aria-label="Blog post page navigation"]')
        .contains('Older Post')
        .should('not.exist');
    });
  });
});
