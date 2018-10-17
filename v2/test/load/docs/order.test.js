import createOrder from '@lib/load/docs/order';

describe('createOrder', () => {
  test('multiple sidebars with subcategory', () => {
    const result = createOrder({
      docs: {
        Category1: {
          'Subcategory 1': ['doc1'],
          'Subcategory 2': ['doc2'],
        },
        Category2: ['doc3', 'doc4'],
      },
      otherDocs: {
        Category1: ['doc5'],
      },
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
      docs: {
        Category1: ['doc1', 'doc2'],
        Category2: ['doc3', 'doc4'],
      },
      otherDocs: {
        Category1: ['doc5'],
      },
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
      docs: {
        Category1: ['doc1'],
      },
      'version-1.2.3-docs': {
        Category1: ['version-1.2.3-doc2'],
        Category2: ['version-1.2.3-doc1'],
      },
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

  test('edge cases', () => {
    expect(createOrder({})).toEqual({});
    expect(createOrder(null)).toEqual({});
    expect(createOrder(undefined)).toEqual({});
  });
});
