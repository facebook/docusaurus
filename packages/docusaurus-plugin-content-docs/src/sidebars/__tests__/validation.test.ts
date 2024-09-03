/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateSidebars, validateCategoryMetadataFile} from '../validation';
import type {SidebarsConfig, CategoryMetadataFile} from '../types';

describe('validateSidebars', () => {
  it('throw for bad value', () => {
    expect(() => validateSidebars({sidebar: [{type: 42}]}))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": 42,
        "undefined" [1]: -- missing --
      }

      [1] Unknown sidebar item type "42"."
    `);
  });

  it('accept empty object', () => {
    const sidebars: SidebarsConfig = {};
    validateSidebars(sidebars);
  });

  it('accept valid values', () => {
    const sidebars: SidebarsConfig = {
      sidebar1: [
        {type: 'doc', id: 'doc1'},
        {type: 'doc', id: 'doc2'},
        {
          type: 'category',
          label: 'Category',
          items: [{type: 'doc', id: 'doc3'}],
        },
      ],
    };
    validateSidebars(sidebars);
  });

  it('sidebar category wrong label', () => {
    expect(
      () =>
        validateSidebars({
          docs: [
            {
              type: 'category',
              label: true,
              items: [{type: 'doc', id: 'doc1'}],
            },
          ],
        }),

      // eslint-disable-next-line jest/no-large-snapshots
    ).toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "category",
        "items": [
          {
            "type": "doc",
            "id": "doc1"
          }
        ],
        "label" [1]: true
      }

      [1] "label" must be a string"
    `);
  });

  it('sidebars link wrong label', () => {
    expect(() =>
      validateSidebars({
        docs: [
          {
            type: 'link',
            label: false,
            href: 'https://github.com',
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "link",
        "href": "https://github.com",
        "label" [1]: false
      }

      [1] "label" must be a string"
    `);
  });

  it('sidebars link wrong href', () => {
    expect(() =>
      validateSidebars({
        docs: [
          {
            type: 'link',
            label: 'GitHub',
            href: ['example.com'],
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "link",
        "label": "GitHub",
        "href" [1]: [
          "example.com"
        ]
      }

      [1] "href" contains an invalid value"
    `);
  });

  it('sidebars with unknown sidebar item type', () => {
    expect(() =>
      validateSidebars({
        docs: [
          {
            type: 'superman',
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "superman",
        "undefined" [1]: -- missing --
      }

      [1] Unknown sidebar item type "superman"."
    `);
  });

  it('sidebars category missing items', () => {
    expect(() =>
      validateSidebars({
        docs: [
          {
            type: 'category',
            label: 'category',
          },

          {
            type: 'ref',
            id: 'hello',
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "category",
        "label": "category",
        "items" [1]: -- missing --
      }

      [1] "items" is required"
    `);
  });

  it('sidebars category wrong field', () => {
    expect(() =>
      validateSidebars({
        docs: [
          {
            type: 'category',
            label: 'category',
            items: [],
            href: 'https://google.com',
          },

          {
            type: 'ref',
            id: 'hello',
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "category",
        "label": "category",
        "items": [],
        "href" [1]: "https://google.com"
      }

      [1] "href" is not allowed"
    `);
  });

  it('sidebar category wrong items', () => {
    expect(() =>
      validateSidebars({
        docs: {
          Test: [
            {
              type: 'category',
              label: 'Category Label',
              items: 'doc1',
            },
          ],
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(`"sidebar.forEach is not a function"`);
  });

  it('sidebars item doc but id is not a string', () => {
    expect(() =>
      validateSidebars({
        docs: [
          {
            type: 'doc',
            id: ['doc1'],
          },
        ],
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "doc",
        "id" [1]: [
          "doc1"
        ]
      }

      [1] "id" must be a string"
    `);
  });

  it('html type requires a value', () => {
    const sidebars: SidebarsConfig = {
      sidebar1: [
        {
          // @ts-expect-error - test missing value
          type: 'html',
        },
      ],
    };
    expect(() => validateSidebars(sidebars))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        "type": "html",
        "value" [1]: -- missing --
      }

      [1] "value" is required"
    `);
  });

  it('html type accepts valid values', () => {
    const sidebars: SidebarsConfig = {
      sidebar1: [
        {
          type: 'html',
          value: '<p>Hello, World!</p>',
          defaultStyle: true,
          className: 'foo',
        },
      ],
    };
    validateSidebars(sidebars);
  });
});

describe('validateCategoryMetadataFile', () => {
  // TODO add more tests

  it('throw for bad value', () => {
    expect(() =>
      validateCategoryMetadataFile(42),
    ).toThrowErrorMatchingInlineSnapshot(`""value" must be of type object"`);
  });

  it('accept empty object', () => {
    const content: CategoryMetadataFile = {};
    expect(validateCategoryMetadataFile(content)).toEqual(content);
  });

  it('accept valid values', () => {
    const content: CategoryMetadataFile = {
      className: 'className',
      label: 'Category Label',
      description: 'Category Description',
      link: {
        type: 'generated-index',
        slug: 'slug',
        title: 'title',
        description: 'description',
      },
      collapsible: true,
      collapsed: true,
      position: 3,
    };
    expect(validateCategoryMetadataFile(content)).toEqual(content);
  });

  it('rejects permalink', () => {
    const content: CategoryMetadataFile = {
      className: 'className',
      label: 'Category Label',
      link: {
        type: 'generated-index',
        slug: 'slug',
        // @ts-expect-error: rejected on purpose
        permalink: 'somePermalink',
        title: 'title',
        description: 'description',
      },
      collapsible: true,
      collapsed: true,
      position: 3,
    };
    expect(() =>
      validateCategoryMetadataFile(content),
    ).toThrowErrorMatchingInlineSnapshot(`""link.permalink" is not allowed"`);
  });
});
