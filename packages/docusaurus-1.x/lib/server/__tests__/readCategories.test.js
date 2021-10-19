/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const readCategories = require('../readCategories');
const generalMetadata = require('./__fixtures__/metadata.js');
const subCategoryMetadata = require('./__fixtures__/metadata-subcategories.js');

const languages = [
  {
    enabled: true,
    name: 'English',
    tag: 'en',
  },
  {
    enabled: true,
    name: 'Foo',
    tag: 'ko',
  },
];

const languagesMultiple = [
  {
    enabled: false,
    name: 'English',
    tag: 'en',
  },
  {
    enabled: true,
    name: 'Foo',
    tag: 'ko',
  },
];

describe('readCategories', () => {
  test('should return proper categories and their pages', () => {
    const categories = readCategories('docs', generalMetadata, languages);

    expect(categories.en).toBeDefined();
    expect(categories.en.length).toBe(2);
    expect(categories.en).toMatchSnapshot();
  });

  test('should return proper data with categories and sub categories', () => {
    const categories = readCategories('docs', subCategoryMetadata, languages);

    expect(categories.en).toBeDefined();
    expect(categories.ko).toBeDefined();
    expect(categories.en.length).toBe(2);
    expect(categories.en).toMatchSnapshot();
  });

  test('should return proper languages when not enabled', () => {
    const categories = readCategories(
      'docs',
      generalMetadata,
      languagesMultiple,
    );

    expect(categories.en).not.toBeDefined();
    expect(categories.ko).toBeDefined();
  });
});
