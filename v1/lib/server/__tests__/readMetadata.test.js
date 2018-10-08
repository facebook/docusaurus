/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {readSidebar} = require('../readMetadata');
const sidebar = require('./__fixtures__/sidebar');
const sidebarSubCategories = require('./__fixtures__/sidebar-subcategories');

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
    it('should verify regular category data and verify sort', () => {
      const order = readSidebar(sidebar);

      // Put in this order to verify sort
      ['doc1', 'doc2', 'doc4', 'doc3'].forEach((id, index) => {
        expect(order[id]).toBeDefined();
        expect(order[id].sort).toBe(index + 1);
      });

      expect(order.doc1.previous).toBeUndefined();
      expect(order.doc2.previous).toBe('doc1');

      expect(order.doc1.next).toBe('doc2');
      expect(order.doc2.next).toBe('doc4');

      expect(order.doc1.sub_category).toBeFalsy();
    });

    test('should verify sub category data and verify sort', () => {
      const order = readSidebar(sidebarSubCategories);

      // Put in this order to verify sort
      ['doc2', 'doc1', 'doc3', 'doc5', 'doc4'].forEach((id, index) => {
        expect(order[id]).toBeDefined();
        expect(order[id].sort).toBe(index + 1);
      });

      expect(order.doc2.sidebar).toBe('docs');
      expect(order.doc2.category).toBe('First Category');
      expect(order.doc2.sub_category).toBe('Sub Cat One');

      expect(order.doc1.category).toBe('First Category');
      expect(order.doc1.sub_category).toBe('Sub Cat One');

      expect(order.doc3.category).toBe('First Category');
      expect(order.doc3.sub_category).toBe('Sub Cat Two');
    });
  });
});
