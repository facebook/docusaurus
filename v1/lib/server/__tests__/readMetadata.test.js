/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {readSidebar} = require('../readMetadata');
const sidebar = require('./__fixtures__/sidebar');
const sidebarSubcategories = require('./__fixtures__/sidebar-subcategories');

jest.mock('../env', () => ({
  translation: {
    enabled: true,
    enabledLanguages: () => [
      {
        enabled: true,
        name: 'English',
        tag: 'en',
      },
      {
        enabled: true,
        name: '한국어',
        tag: 'ko',
      },
    ],
  },
  versioning: {
    enabled: true,
    defaultVersion: '1.0.0',
  },
}));

jest.mock(`${process.cwd()}/siteConfig.js`, () => true, {virtual: true});
jest.mock(`${process.cwd()}/sidebar.json`, () => true, {virtual: true});

describe('readMetadata', () => {
  describe('readSidebar', () => {
    test('should verify sub category data and verify order', () => {
      const items = readSidebar(sidebarSubcategories);

      // Put in this order to verify order
      const expectedItems = [
        {
          id: 'doc1',
          order: 1,
          category: 'First Category',
          subcategory: null,
          sidebar: 'docs',
        },
        {
          id: 'doc2',
          order: 2,
          category: 'First Category',
          subcategory: null,
          sidebar: 'docs',
        },
        {
          id: 'doc3',
          order: 3,
          category: 'Second Category',
          subcategory: null,
          sidebar: 'docs',
        },
        {
          id: 'doc4',
          order: 4,
          category: 'Second Category',
          subcategory: 'First Subcategory',
          sidebar: 'docs',
        },
        {
          id: 'doc5',
          order: 5,
          category: 'Second Category',
          subcategory: null,
          sidebar: 'docs',
        },
        {
          id: 'doc6',
          order: 6,
          category: 'Third Category',
          subcategory: 'Second Subcategory',
          sidebar: 'docs',
        },
        {
          id: 'doc7',
          order: 7,
          category: 'Third Category',
          subcategory: 'Third Subcategory',
          sidebar: 'docs',
        },
      ];
      expectedItems.forEach((expectedItem, index) => {
        const item = items[expectedItem.id];
        expect(item.order).toBe(expectedItem.order);
        expect(item.category).toBe(expectedItem.category);
        expect(item.subcategory).toBe(expectedItem.subcategory);
        expect(item.sidebar).toBe(expectedItem.sidebar);
      });
    });
  });
});
