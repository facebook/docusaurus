/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import createOrder from '../src/order';

describe('createOrder', () => {
  test('multiple sidebars with subcategory', () => {
    const result = createOrder({
      docs: [
        {
          type: 'category',
          label: 'Category1',
          items: [
            {
              type: 'category',
              label: 'Subcategory 1',
              items: [{type: 'doc', id: 'doc1'}],
            },
            {
              type: 'category',
              label: 'Subcategory 2',
              items: [{type: 'doc', id: 'doc2'}],
            },
          ],
        },
        {
          type: 'category',
          label: 'Category2',
          items: [{type: 'doc', id: 'doc3'}, {type: 'doc', id: 'doc4'}],
        },
      ],
      otherDocs: [
        {
          type: 'category',
          label: 'Category1',
          items: [{type: 'doc', id: 'doc5'}],
        },
      ],
    });
    expect(result).toEqual({
      doc1: {
        category: 'Category1',
        subCategory: 'Subcategory 1',
        next: 'doc2',
        previous: undefined,
        sidebar: 'docs',
      },
      doc2: {
        category: 'Category1',
        subCategory: 'Subcategory 2',
        next: 'doc3',
        previous: 'doc1',
        sidebar: 'docs',
      },
      doc3: {
        category: 'Category2',
        subCategory: undefined,
        next: 'doc4',
        previous: 'doc2',
        sidebar: 'docs',
      },
      doc4: {
        category: 'Category2',
        subCategory: undefined,
        next: undefined,
        previous: 'doc3',
        sidebar: 'docs',
      },
      doc5: {
        category: 'Category1',
        subCategory: undefined,
        next: undefined,
        previous: undefined,
        sidebar: 'otherDocs',
      },
    });
  });
  test('multiple sidebars without subcategory', () => {
    const result = createOrder({
      docs: [
        {
          type: 'category',
          label: 'Category1',
          items: [{type: 'doc', id: 'doc1'}, {type: 'doc', id: 'doc2'}],
        },
        {
          type: 'category',
          label: 'Category2',
          items: [{type: 'doc', id: 'doc3'}, {type: 'doc', id: 'doc4'}],
        },
      ],
      otherDocs: [
        {
          type: 'category',
          label: 'Category1',
          items: [{type: 'doc', id: 'doc5'}],
        },
      ],
    });
    expect(result).toEqual({
      doc1: {
        category: 'Category1',
        subCategory: undefined,
        next: 'doc2',
        previous: undefined,
        sidebar: 'docs',
      },
      doc2: {
        category: 'Category1',
        subCategory: undefined,
        next: 'doc3',
        previous: 'doc1',
        sidebar: 'docs',
      },
      doc3: {
        category: 'Category2',
        subCategory: undefined,
        next: 'doc4',
        previous: 'doc2',
        sidebar: 'docs',
      },
      doc4: {
        category: 'Category2',
        subCategory: undefined,
        next: undefined,
        previous: 'doc3',
        sidebar: 'docs',
      },
      doc5: {
        category: 'Category1',
        subCategory: undefined,
        next: undefined,
        previous: undefined,
        sidebar: 'otherDocs',
      },
    });
  });

  test('versioned sidebars', () => {
    const result = createOrder({
      docs: [
        {
          type: 'category',
          label: 'Category1',
          items: [{type: 'doc', id: 'doc1'}],
        },
      ],
      'version-1.2.3-docs': [
        {
          type: 'category',
          label: 'Category1',
          items: [{type: 'doc', id: 'version-1.2.3-doc2'}],
        },
        {
          type: 'category',
          label: 'Category2',
          items: [{type: 'doc', id: 'version-1.2.3-doc1'}],
        },
      ],
    });
    expect(result).toEqual({
      doc1: {
        category: 'Category1',
        subCategory: undefined,
        next: undefined,
        previous: undefined,
        sidebar: 'docs',
      },
      'version-1.2.3-doc1': {
        category: 'Category2',
        subCategory: undefined,
        next: undefined,
        previous: 'version-1.2.3-doc2',
        sidebar: 'version-1.2.3-docs',
      },
      'version-1.2.3-doc2': {
        category: 'Category1',
        subCategory: undefined,
        next: 'version-1.2.3-doc1',
        previous: undefined,
        sidebar: 'version-1.2.3-docs',
      },
    });
  });

  test('multiple sidebars with subcategories, refs and external links', () => {
    const result = createOrder({
      docs: [
        {
          type: 'category',
          label: 'Category1',
          items: [
            {
              type: 'category',
              label: 'Subcategory 1',
              items: [{type: 'link', href: '//example.com', label: 'bar'}],
            },
            {
              type: 'category',
              label: 'Subcategory 2',
              items: [{type: 'doc', id: 'doc2'}],
            },
            {
              type: 'category',
              label: 'Subcategory 1',
              items: [{type: 'link', href: '//example2.com', label: 'baz'}],
            },
          ],
        },
        {
          type: 'category',
          label: 'Category2',
          items: [{type: 'doc', id: 'doc3'}, {type: 'ref', id: 'doc4'}],
        },
      ],
      otherDocs: [
        {
          type: 'category',
          label: 'Category1',
          items: [{type: 'doc', id: 'doc5'}],
        },
      ],
    });
    expect(result).toEqual({
      doc2: {
        category: 'Category1',
        subCategory: 'Subcategory 2',
        next: 'doc3',
        previous: undefined,
        sidebar: 'docs',
      },
      doc3: {
        category: 'Category2',
        subCategory: undefined,
        next: undefined,
        previous: 'doc2',
        sidebar: 'docs',
      },
      doc5: {
        category: 'Category1',
        subCategory: undefined,
        next: undefined,
        previous: undefined,
        sidebar: 'otherDocs',
      },
    });
  });

  test('edge cases', () => {
    expect(createOrder({})).toEqual({});
    expect(createOrder(undefined)).toEqual({});
    expect(() => createOrder(null)).toThrowErrorMatchingInlineSnapshot(
      `"Cannot convert undefined or null to object"`,
    );
  });
});
