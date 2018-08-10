import loadPages from '@lib/load/pages.js';
import path from 'path';

describe('loadPages', () => {
  test('valid pages', async () => {
    const pagesDir = path.join(__dirname, '__fixtures__', 'simple-pages');
    const pagesData = await loadPages(pagesDir);
    expect(pagesData).toMatchSnapshot();
    expect(pagesData).not.toBeNull();
  });

  test('invalid pages', async () => {
    const nonExistingDir = path.join(__dirname, '__fixtures__', 'nonExisting');
    const pagesData = await loadPages(nonExistingDir);
    expect(pagesData).toEqual([]);
  });
});
