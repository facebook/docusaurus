import genRoutesConfig from '@lib/load/routes';
import loadDocs from '@lib/load/docs';
import loadPages from '@lib/load/pages';
import path from 'path';

describe('genRoutesConfig', () => {
  const pagesDir = path.join(__dirname, '__fixtures__', 'simple-pages');
  const docsDir = path.join(__dirname, '__fixtures__', 'simple-docs');

  test('website with pages and docs', async () => {
    const props = {
      docsData: await loadDocs(docsDir),
      pagesData: await loadPages(pagesDir)
    };
    const routes = await genRoutesConfig(props);
    expect(routes).toMatchSnapshot();
  });

  test('website with only pages', async () => {
    const props = {
      pagesData: await loadPages(pagesDir)
    };
    const routes = await genRoutesConfig(props);
    expect(routes).toMatchSnapshot();
  });

  test('website with only docs', async () => {
    const props = {
      docsData: await loadDocs(docsDir)
    };
    const routes = await genRoutesConfig(props);
    expect(routes).toMatchSnapshot();
  });

  test('website with no docs/pages', async () => {
    const routes = await genRoutesConfig({});
    expect(routes).toMatchSnapshot();
  });
});
