/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadContext} from '@docusaurus/core/src/server/index';
import processMetadata from '../metadata';
import loadEnv from '../env';

const fixtureDir = path.join(__dirname, '__fixtures__');

describe('simple site', () => {
  const simpleSiteDir = path.join(fixtureDir, 'simple-site');
  const context = loadContext(simpleSiteDir);
  const routeBasePath = 'docs';
  const docsDir = path.resolve(simpleSiteDir, routeBasePath);

  const env = loadEnv(simpleSiteDir);

  test('normal docs', async () => {
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');
    const options = {
      routeBasePath,
    };

    const [dataA, dataB] = await Promise.all([
      processMetadata({
        source: sourceA,
        refDir: docsDir,
        context,
        options,
        env,
      }),
      processMetadata({
        source: sourceB,
        refDir: docsDir,
        context,
        options,
        env,
      }),
    ]);

    expect(dataA).toEqual({
      id: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      source: path.join('@site', routeBasePath, sourceA),
      title: 'Bar',
      description: 'This is custom description',
    });
    expect(dataB).toEqual({
      id: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/hello',
      source: path.join('@site', routeBasePath, sourceB),
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
    });
  });

  test('homePageId doc', async () => {
    const source = path.join('hello.md');
    const options = {
      routeBasePath,
      homePageId: 'hello',
    };

    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      options,
      env,
    });

    expect(data).toEqual({
      id: 'hello',
      isDocsHomePage: true,
      permalink: '/docs/',
      source: path.join('@site', routeBasePath, source),
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
    });
  });

  test('homePageId doc nested', async () => {
    const source = path.join('foo', 'bar.md');
    const options = {
      routeBasePath,
      homePageId: 'foo/bar',
    };

    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      options,
      env,
    });

    expect(data).toEqual({
      id: 'foo/bar',
      isDocsHomePage: true,
      permalink: '/docs/',
      source: path.join('@site', routeBasePath, source),
      title: 'Bar',
      description: 'This is custom description',
    });
  });

  test('docs with editUrl', async () => {
    const editUrl =
      'https://github.com/facebook/docusaurus/edit/master/website';
    const source = path.join('foo', 'baz.md');
    const options = {
      routeBasePath,
      editUrl,
    };

    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      options,
      env,
    });

    expect(data).toEqual({
      id: 'foo/baz',
      isDocsHomePage: false,
      permalink: '/docs/foo/bazSlug.html',
      source: path.join('@site', routeBasePath, source),
      title: 'baz',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/docs/foo/baz.md',
      description: 'Images',
    });
  });

  test('docs with custom editUrl & unrelated frontmatter', async () => {
    const source = 'lorem.md';
    const options = {
      routeBasePath,
    };

    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      options,
      env,
    });

    expect(data).toEqual({
      id: 'lorem',
      isDocsHomePage: false,
      permalink: '/docs/lorem',
      source: path.join('@site', routeBasePath, source),
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
    });

    // unrelated frontmatter is not part of metadata
    // @ts-expect-error: It doesn't exist, so the test will show it's undefined.
    expect(data.unrelated_frontmatter).toBeUndefined();
  });

  test('docs with last update time and author', async () => {
    const source = 'lorem.md';
    const options = {
      routeBasePath,
      showLastUpdateAuthor: true,
      showLastUpdateTime: true,
    };

    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      options,
      env,
    });

    expect(data).toEqual({
      id: 'lorem',
      isDocsHomePage: false,
      permalink: '/docs/lorem',
      source: path.join('@site', routeBasePath, source),
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
      lastUpdatedAt: 1539502055,
      lastUpdatedBy: 'Author',
    });
  });

  test('docs with null custom_edit_url', async () => {
    const source = 'ipsum.md';
    const options = {
      routeBasePath,
      showLastUpdateAuthor: true,
      showLastUpdateTime: true,
    };

    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      options,
      env,
    });

    expect(data).toEqual({
      id: 'ipsum',
      isDocsHomePage: false,
      permalink: '/docs/ipsum',
      source: path.join('@site', routeBasePath, source),
      title: 'ipsum',
      editUrl: null,
      description: 'Lorem ipsum.',
      lastUpdatedAt: 1539502055,
      lastUpdatedBy: 'Author',
    });
  });

  test('docs with invalid id', async () => {
    const badSiteDir = path.join(fixtureDir, 'bad-id-site');
    const options = {
      routeBasePath,
    };

    await expect(
      processMetadata({
        source: 'invalid-id.md',
        refDir: path.join(badSiteDir, 'docs'),
        context,
        options,
        env,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Document id cannot include \\"/\\"."`,
    );
  });

  test('docs with invalid slug', async () => {
    const badSiteDir = path.join(fixtureDir, 'bad-slug-site');
    const options = {
      routeBasePath,
    };

    await expect(
      processMetadata({
        source: 'invalid-slug.md',
        refDir: path.join(badSiteDir, 'docs'),
        context,
        options,
        env,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Document slug cannot include \\"/\\"."`,
    );
  });

  test('docs with slug on doc home', async () => {
    const badSiteDir = path.join(fixtureDir, 'bad-slug-on-doc-home-site');
    const options = {
      routeBasePath,
      homePageId: 'docWithSlug',
    };

    await expect(
      processMetadata({
        source: 'docWithSlug.md',
        refDir: path.join(badSiteDir, 'docs'),
        context,
        options,
        env,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"The docs homepage (homePageId=docWithSlug) is not allowed to have a frontmatter slug=docWithSlug.html => you have to chooser either homePageId or slug, not both"`,
    );
  });
});

describe('versioned site', () => {
  const siteDir = path.join(fixtureDir, 'versioned-site');
  const context = loadContext(siteDir);
  const routeBasePath = 'docs';
  const docsDir = path.resolve(siteDir, routeBasePath);
  const env = loadEnv(siteDir);
  const {docsDir: versionedDir} = env.versioning;

  test('master/next docs', async () => {
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');
    const options = {
      routeBasePath,
    };

    const [dataA, dataB] = await Promise.all([
      processMetadata({
        source: sourceA,
        refDir: docsDir,
        context,
        options,
        env,
      }),
      processMetadata({
        source: sourceB,
        refDir: docsDir,
        context,
        options,
        env,
      }),
    ]);

    expect(dataA).toEqual({
      id: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/next/foo/barSlug',
      source: path.join('@site', routeBasePath, sourceA),
      title: 'bar',
      description: 'This is next version of bar.',
      version: 'next',
    });
    expect(dataB).toEqual({
      id: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/next/hello',
      source: path.join('@site', routeBasePath, sourceB),
      title: 'hello',
      description: 'Hello next !',
      version: 'next',
    });
  });

  test('versioned docs', async () => {
    const sourceA = path.join('version-1.0.0', 'foo', 'bar.md');
    const sourceB = path.join('version-1.0.0', 'hello.md');
    const sourceC = path.join('version-1.0.1', 'foo', 'bar.md');
    const sourceD = path.join('version-1.0.1', 'hello.md');
    const options = {
      routeBasePath,
    };

    const [dataA, dataB, dataC, dataD] = await Promise.all([
      processMetadata({
        source: sourceA,
        refDir: versionedDir,
        context,
        options,
        env,
      }),
      processMetadata({
        source: sourceB,
        refDir: versionedDir,
        context,
        options,
        env,
      }),
      processMetadata({
        source: sourceC,
        refDir: versionedDir,
        context,
        options,
        env,
      }),
      processMetadata({
        source: sourceD,
        refDir: versionedDir,
        context,
        options,
        env,
      }),
    ]);

    expect(dataA).toEqual({
      id: 'version-1.0.0/foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/foo/barSlug',
      source: path.join('@site', path.relative(siteDir, versionedDir), sourceA),
      title: 'bar',
      description: 'Bar 1.0.0 !',
      version: '1.0.0',
    });
    expect(dataB).toEqual({
      id: 'version-1.0.0/hello',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/hello',
      source: path.join('@site', path.relative(siteDir, versionedDir), sourceB),
      title: 'hello',
      description: 'Hello 1.0.0 !',
      version: '1.0.0',
    });
    expect(dataC).toEqual({
      id: 'version-1.0.1/foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      source: path.join('@site', path.relative(siteDir, versionedDir), sourceC),
      title: 'bar',
      description: 'Bar 1.0.1 !',
      version: '1.0.1',
    });
    expect(dataD).toEqual({
      id: 'version-1.0.1/hello',
      isDocsHomePage: false,
      permalink: '/docs/hello',
      source: path.join('@site', path.relative(siteDir, versionedDir), sourceD),
      title: 'hello',
      description: 'Hello 1.0.1 !',
      version: '1.0.1',
    });
  });
});
