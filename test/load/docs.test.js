import loadDocs from '@lib/load/docs.js';
import path from 'path';

describe('loadDocs', () => {
  test('simple docs', async () => {
    const docsDir = path.join(__dirname, '__fixtures__', 'simple-docs');
    const docsData = await loadDocs(docsDir);
    expect(docsData).toMatchSnapshot();
    expect(docsData).not.toBeNull();
  });

  test('no docs', async () => {
    const nonExistingDocsDir = path.join(
      __dirname,
      '__fixtures__',
      'nonExistingDocs'
    );
    const docsData = await loadDocs(nonExistingDocsDir);
    expect(docsData).toEqual([]);
  });
});
