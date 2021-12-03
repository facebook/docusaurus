/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateSidebars, validateCategoryMetadataFile} from '../validation';
import {CategoryMetadataFile} from '../generator';
import {SidebarsConfig} from '../types';

describe('validateSidebars', () => {
  // TODO add more tests

  // TODO it seems many error cases are not validated properly
  // and error messages are quite bad
  test('throw for bad value', async () => {
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

  test('accept empty object', async () => {
    const sidebars: SidebarsConfig = {};
    validateSidebars(sidebars);
  });

  test('accept valid values', async () => {
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
});

describe('validateCategoryMetadataFile', () => {
  // TODO add more tests

  test('throw for bad value', async () => {
    expect(() =>
      validateCategoryMetadataFile(42),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"value\\" must be of type object"`,
    );
  });

  test('accept empty object', async () => {
    const content: CategoryMetadataFile = {};
    expect(validateCategoryMetadataFile(content)).toEqual(content);
  });

  test('accept valid values', async () => {
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

  test('rejects permalink', async () => {
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
