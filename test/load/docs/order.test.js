import createOrder from '@lib/load/docs/order';

describe('createOrder', () => {
  test('should populate docs index from multiple sidebars', () => {
    const result = createOrder({
      docs: {
        Category1: ['doc1', 'doc2'],
        Category2: ['doc3', 'doc4']
      },
      otherDocs: {
        Category1: ['doc5']
      }
    });
    expect(result).toMatchSnapshot();
  });

  test('should resolve docs from older versions', () => {
    const result = createOrder({
      docs: {
        Category1: ['doc1']
      },
      'version-1.2.3-docs': {
        Category1: ['version-1.2.3-doc2'],
        Category2: ['version-1.2.3-doc1']
      }
    });
    expect(result).toMatchSnapshot();
  });

  test('edge cases', () => {
    expect(createOrder({})).toEqual({});
    expect(createOrder(null)).toEqual({});
    expect(createOrder(undefined)).toEqual({});
  });
});
