/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateSidebars, validateCategoryMetadataFile} from '../validation';
import type {SidebarsConfig, CategoryMetadataFile} from '../types';

describe('validateSidebars', () => {
  it('throw for bad value', async () => {
    expect(() => validateSidebars({sidebar: [{type: 42}]}))
      .toThrowErrorMatchingInlineSnapshot(`
      "{
        \\"type\\": 42,
        [41m\\"undefined\\"[0m[31m [1]: -- missing --[0m
      }
      [31m
      [1] Unknown sidebar item type \\"42\\".[0m"
    `);
  });

  it('accept empty object', async () => {
    const sidebars: SidebarsConfig = {};
    validateSidebars(sidebars);
  });

  it('accept valid values', async () => {
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
        \\"type\\": \\"category\\",
        \\"items\\": [
          {
            \\"type\\": \\"doc\\",
            \\"id\\": \\"doc1\\"
          }
        ],
        \\"label\\" [31m[1][0m: true
      }
      [31m
      [1] \\"label\\" must be a string[0m"
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
              \\"type\\": \\"link\\",
              \\"href\\": \\"https://github.com\\",
              \\"label\\" [31m[1][0m: false
            }
            [31m
            [1] \\"label\\" must be a string[0m"
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
              \\"type\\": \\"link\\",
              \\"label\\": \\"GitHub\\",
              \\"href\\" [31m[1][0m: [
                \\"example.com\\"
              ]
            }
            [31m
            [1] \\"href\\" contains an invalid value[0m"
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
              \\"type\\": \\"superman\\",
              [41m\\"undefined\\"[0m[31m [1]: -- missing --[0m
            }
            [31m
            [1] Unknown sidebar item type \\"superman\\".[0m"
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
        \\"type\\": \\"category\\",
        \\"label\\": \\"category\\",
        [41m\\"items\\"[0m[31m [1]: -- missing --[0m
      }
      [31m
      [1] \\"items\\" is required[0m"
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
        \\"type\\": \\"category\\",
        \\"label\\": \\"category\\",
        \\"items\\": [],
        \\"href\\" [31m[1][0m: \\"https://google.com\\"
      }
      [31m
      [1] \\"href\\" is not allowed[0m"
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

  it('sidebars item doc but id is not a string', async () => {
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
              \\"type\\": \\"doc\\",
              \\"id\\" [31m[1][0m: [
                \\"doc1\\"
              ]
            }
            [31m
            [1] \\"id\\" must be a string[0m"
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
        \\"type\\": \\"html\\",
        [41m\\"value\\"[0m[31m [1]: -- missing --[0m
      }
      [31m
      [1] \\"value\\" is required[0m"
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

  it('throw for bad value', async () => {
    expect(() =>
      validateCategoryMetadataFile(42),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"value\\" must be of type object"`,
    );
  });

  it('accept empty object', async () => {
    const content: CategoryMetadataFile = {};
    expect(validateCategoryMetadataFile(content)).toEqual(content);
  });

  it('accept valid values', async () => {
    const content: CategoryMetadataFile = {
      className: 'className',
      label: 'Category Label',
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

  it('rejects permalink', async () => {
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
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"link.permalink\\" is not allowed"`,
    );
  });
});
