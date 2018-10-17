import loadPages from '@lib/load/pages';
import path from 'path';
import loadSetup from '../loadSetup';

describe('loadPages', () => {
  test('simple website', async () => {
    const {pagesDir, env, siteConfig} = await loadSetup('simple');
    const pagesMetadatas = await loadPages({pagesDir, env, siteConfig});
    expect(pagesMetadatas).toEqual([
      {
        permalink: '/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        permalink: '/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
    ]);
  });

  test('versioned website', async () => {
    const {pagesDir, env, siteConfig} = await loadSetup('versioned');
    const pagesMetadatas = await loadPages({pagesDir, env, siteConfig});
    expect(pagesMetadatas).toEqual([
      {
        permalink: '/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        permalink: '/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
    ]);
  });

  test('versioned & translated website', async () => {
    const {pagesDir, env, siteConfig} = await loadSetup('transversioned');
    const pagesMetadatas = await loadPages({pagesDir, env, siteConfig});
    expect(pagesMetadatas).toEqual([
      {
        language: 'en',
        permalink: '/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        language: 'en',
        permalink: '/en/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        language: 'ko',
        permalink: '/ko/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        language: 'en',
        permalink: '/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
      {
        language: 'en',
        permalink: '/en/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
      {
        language: 'ko',
        permalink: '/ko/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
    ]);
  });

  test('translated website', async () => {
    const {pagesDir, env, siteConfig} = await loadSetup('translated');
    const pagesMetadatas = await loadPages({pagesDir, env, siteConfig});
    expect(pagesMetadatas).toEqual([
      {
        language: 'en',
        permalink: '/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        language: 'en',
        permalink: '/en/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        language: 'ko',
        permalink: '/ko/',
        source: path.join(pagesDir, 'index.js'),
      },
      {
        language: 'en',
        permalink: '/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
      {
        language: 'en',
        permalink: '/en/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
      {
        language: 'ko',
        permalink: '/ko/hello/world',
        source: path.join(pagesDir, 'hello', 'world.js'),
      },
    ]);
  });

  test('invalid pages', async () => {
    const {env, siteConfig} = await loadSetup('simple');
    const pagesDir = path.join(__dirname, '__fixtures__', 'nonExisting');
    const pagesMetadatas = await loadPages({pagesDir, env, siteConfig});
    expect(pagesMetadatas).toEqual([]);
  });
});
