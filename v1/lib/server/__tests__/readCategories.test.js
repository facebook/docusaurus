/**
 * Copyright (c) 2017-present, Facebook, Inc.
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

    expect(categories.en[0].name).toBe('Test');
    expect(categories.en[0].links.length).toBe(2);
    expect(categories.en[0].links[0].id).toBe('en-doc1');
    expect(categories.en[0].links[1].id).toBe('en-doc2');

    expect(categories.en[1].name).toBe('Test 2');
    expect(categories.en[1].links.length).toBe(1);
    expect(categories.en[1].links[0].id).toBe('en-doc3');
  });

  test('should return proper data with categories and sub categories', () => {
    const categories = readCategories('docs', subCategoryMetadata, languages);

    expect(categories.en).toBeDefined();
    expect(categories.ko).toBeDefined();
    expect(categories.en.length).toBe(2);

    expect(categories.en[0].name).toBe('Test');
    expect(categories.en[0].links.length).toBe(0);
    expect(categories.en[0].sub_categories.length).toBe(2);

    expect(categories.en[0].sub_categories[0].name).toBe('Sub Cat 1');
    expect(categories.en[0].sub_categories[0].links.length).toBe(2);
    expect(categories.en[0].sub_categories[0].links[0].id).toBe('en-doc1');
    expect(categories.en[0].sub_categories[0].links[1].id).toBe('en-doc2');

    expect(categories.en[0].sub_categories[1].name).toBe('Sub Cat 2');
    expect(categories.en[0].sub_categories[1].links.length).toBe(1);
    expect(categories.en[0].sub_categories[1].links[0].id).toBe('en-doc3');

    expect(categories.en[1].name).toBe('Test 2');
    expect(categories.en[1].links.length).toBe(1);
    expect(categories.en[1].links[0].id).toBe('en-doc4');
    expect(categories.en[1].sub_categories).not.toBeDefined();
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
