import loadPages from '@lib/load/pages';
import path from 'path';

describe('loadPages', () => {
  test('valid pages', async () => {
    const pagesDir = path.join(__dirname, '__fixtures__', 'simple-pages');
    const pagesMetadatas = await loadPages(pagesDir);
    pagesMetadatas.sort((a, b) => a.path > b.path); // because it was unordered
    expect(pagesMetadatas).toEqual([
      {
        path: '/',
        source: 'index.js',
      },
      {
        path: '/bar/baz',
        source: 'bar/baz.js',
      },
      {
        path: '/foo',
        source: 'foo.js',
      },
      {
        path: '/foo/',
        source: 'foo/index.js',
      },
    ]);
    expect(pagesMetadatas).not.toBeNull();
  });

  test('invalid pages', async () => {
    const nonExistingDir = path.join(__dirname, '__fixtures__', 'nonExisting');
    const pagesMetadatas = await loadPages(nonExistingDir);
    expect(pagesMetadatas).toEqual([]);
  });
});
