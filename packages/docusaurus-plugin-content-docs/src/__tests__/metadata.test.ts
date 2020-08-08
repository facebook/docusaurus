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
import {MetadataRaw, Env, MetadataOptions} from '../types';
import {LoadContext} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';

const fixtureDir = path.join(__dirname, '__fixtures__');

function createTestHelpers({
  siteDir,
  context,
  env,
  options,
}: {
  siteDir: string;
  context: LoadContext;
  env: Env;
  options: MetadataOptions;
}) {
  async function testMeta(
    refDir: string,
    source: string,
    expectedMetadata: Omit<MetadataRaw, 'source'>,
  ) {
    const metadata = await processMetadata({
      source,
      docsDir: refDir,
      context,
      options,
      env,
    });
    expect(metadata).toEqual({
      ...expectedMetadata,
      source: path.join('@site', path.relative(siteDir, refDir), source),
    });
  }

  async function testSlug(
    refDir: string,
    source: string,
    expectedPermalink: string,
  ) {
    const metadata = await processMetadata({
      source,
      docsDir: refDir,
      context,
      options,
      env,
    });
    expect(metadata.permalink).toEqual(expectedPermalink);
  }

  return {testMeta, testSlug};
}

describe('simple site', () => {
  const siteDir = path.join(fixtureDir, 'simple-site');
  const context = loadContext(siteDir);
  const routeBasePath = 'docs';
  const docsDir = path.resolve(siteDir, routeBasePath);
  const env = loadEnv(siteDir, DEFAULT_PLUGIN_ID);
  const options = {routeBasePath};

  const {testMeta, testSlug} = createTestHelpers({
    siteDir,
    context,
    options,
    env,
  });

  test('normal docs', async () => {
    await testMeta(docsDir, path.join('foo', 'bar.md'), {
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'Bar',
      description: 'This is custom description',
    });
    await testMeta(docsDir, path.join('hello.md'), {
      id: 'hello',
      unversionedId: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/hello',
      slug: '/hello',
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
    });
  });

  test('homePageId doc', async () => {
    const {testMeta: testMetaLocal} = createTestHelpers({
      siteDir,
      options: {
        routeBasePath,
        homePageId: 'hello',
      },
      context,
      env,
    });

    await testMetaLocal(docsDir, path.join('hello.md'), {
      id: 'hello',
      unversionedId: 'hello',
      isDocsHomePage: true,
      permalink: '/docs/',
      slug: '/',
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
    });
  });

  test('homePageId doc nested', async () => {
    const {testMeta: testMetaLocal} = createTestHelpers({
      siteDir,
      options: {
        routeBasePath,
        homePageId: 'foo/bar',
      },
      context,
      env,
    });

    await testMetaLocal(docsDir, path.join('foo', 'bar.md'), {
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: true,
      permalink: '/docs/',
      slug: '/',
      title: 'Bar',
      description: 'This is custom description',
    });
  });

  test('docs with editUrl', async () => {
    const {testMeta: testMetaLocal} = createTestHelpers({
      siteDir,
      options: {
        routeBasePath,
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
      },
      context,
      env,
    });

    await testMetaLocal(docsDir, path.join('foo', 'baz.md'), {
      id: 'foo/baz',
      unversionedId: 'foo/baz',
      isDocsHomePage: false,
      permalink: '/docs/foo/bazSlug.html',
      slug: '/foo/bazSlug.html',
      title: 'baz',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/docs/foo/baz.md',
      description: 'Images',
    });
  });

  test('docs with custom editUrl & unrelated frontmatter', async () => {
    await testMeta(docsDir, 'lorem.md', {
      id: 'lorem',
      unversionedId: 'lorem',
      isDocsHomePage: false,
      permalink: '/docs/lorem',
      slug: '/lorem',
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
    });
  });

  test('docs with last update time and author', async () => {
    const {testMeta: testMetaLocal} = createTestHelpers({
      siteDir,
      options: {
        routeBasePath,
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
      context,
      env,
    });

    await testMetaLocal(docsDir, 'lorem.md', {
      id: 'lorem',
      unversionedId: 'lorem',
      isDocsHomePage: false,
      permalink: '/docs/lorem',
      slug: '/lorem',
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
      lastUpdatedAt: 1539502055,
      lastUpdatedBy: 'Author',
    });
  });

  test('docs with null custom_edit_url', async () => {
    const {testMeta: testMetaLocal} = createTestHelpers({
      siteDir,
      options: {
        routeBasePath,
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
      context,
      env,
    });

    await testMetaLocal(docsDir, 'ipsum.md', {
      id: 'ipsum',
      unversionedId: 'ipsum',
      isDocsHomePage: false,
      permalink: '/docs/ipsum',
      slug: '/ipsum',
      title: 'ipsum',
      editUrl: null,
      description: 'Lorem ipsum.',
      lastUpdatedAt: 1539502055,
      lastUpdatedBy: 'Author',
    });
  });

  test('docs with slugs', async () => {
    await testSlug(
      docsDir,
      path.join('rootRelativeSlug.md'),
      '/docs/rootRelativeSlug',
    );
    await testSlug(
      docsDir,
      path.join('rootAbsoluteSlug.md'),
      '/docs/rootAbsoluteSlug',
    );
    await testSlug(
      docsDir,
      path.join('rootResolvedSlug.md'),
      '/docs/hey/rootResolvedSlug',
    );
    await testSlug(
      docsDir,
      path.join('rootTryToEscapeSlug.md'),
      '/docs/rootTryToEscapeSlug',
    );

    await testSlug(
      docsDir,
      path.join('slugs', 'absoluteSlug.md'),
      '/docs/absoluteSlug',
    );
    await testSlug(
      docsDir,
      path.join('slugs', 'relativeSlug.md'),
      '/docs/slugs/relativeSlug',
    );
    await testSlug(
      docsDir,
      path.join('slugs', 'resolvedSlug.md'),
      '/docs/slugs/hey/resolvedSlug',
    );
    await testSlug(
      docsDir,
      path.join('slugs', 'tryToEscapeSlug.md'),
      '/docs/tryToEscapeSlug',
    );
  });

  test('docs with invalid id', async () => {
    const badSiteDir = path.join(fixtureDir, 'bad-id-site');

    await expect(
      processMetadata({
        source: 'invalid-id.md',
        docsDir: path.join(badSiteDir, 'docs'),
        context,
        options: {
          routeBasePath,
        },
        env,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Document id cannot include \\"/\\"."`,
    );
  });

  test('docs with slug on doc home', async () => {
    const badSiteDir = path.join(fixtureDir, 'bad-slug-on-doc-home-site');

    await expect(
      processMetadata({
        source: 'docWithSlug.md',
        docsDir: path.join(badSiteDir, 'docs'),
        context,
        options: {
          routeBasePath,
          homePageId: 'docWithSlug',
        },
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
  const env = loadEnv(siteDir, DEFAULT_PLUGIN_ID);
  const {docsDir: versionedDir} = env.versioning;
  const options = {routeBasePath};

  const {testMeta, testSlug} = createTestHelpers({
    siteDir,
    context,
    options,
    env,
  });

  test('next docs', async () => {
    await testMeta(docsDir, path.join('foo', 'bar.md'), {
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/next/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'This is next version of bar.',
      version: 'next',
    });
    await testMeta(docsDir, path.join('hello.md'), {
      id: 'hello',
      unversionedId: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/next/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello next !',
      version: 'next',
    });
  });

  test('versioned docs', async () => {
    await testMeta(versionedDir, path.join('version-1.0.0', 'foo', 'bar.md'), {
      id: 'version-1.0.0/foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'Bar 1.0.0 !',
      version: '1.0.0',
    });
    await testMeta(versionedDir, path.join('version-1.0.0', 'hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 !',
      version: '1.0.0',
    });
    await testMeta(versionedDir, path.join('version-1.0.1', 'foo', 'bar.md'), {
      id: 'version-1.0.1/foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'bar',
      description: 'Bar 1.0.1 !',
      version: '1.0.1',
    });
    await testMeta(versionedDir, path.join('version-1.0.1', 'hello.md'), {
      id: 'version-1.0.1/hello',
      unversionedId: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.1 !',
      version: '1.0.1',
    });
  });

  test('next doc slugs', async () => {
    await testSlug(
      docsDir,
      path.join('slugs', 'absoluteSlug.md'),
      '/docs/next/absoluteSlug',
    );
    await testSlug(
      docsDir,
      path.join('slugs', 'relativeSlug.md'),
      '/docs/next/slugs/relativeSlug',
    );
    await testSlug(
      docsDir,
      path.join('slugs', 'resolvedSlug.md'),
      '/docs/next/slugs/hey/resolvedSlug',
    );
    await testSlug(
      docsDir,
      path.join('slugs', 'tryToEscapeSlug.md'),
      '/docs/next/tryToEscapeSlug',
    );
  });

  test('versioned doc slugs', async () => {
    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'rootAbsoluteSlug.md'),
      '/docs/withSlugs/rootAbsoluteSlug',
    );
    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'rootRelativeSlug.md'),
      '/docs/withSlugs/rootRelativeSlug',
    );
    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'rootResolvedSlug.md'),
      '/docs/withSlugs/hey/rootResolvedSlug',
    );
    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'rootTryToEscapeSlug.md'),
      '/docs/withSlugs/rootTryToEscapeSlug',
    );

    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'slugs', 'absoluteSlug.md'),
      '/docs/withSlugs/absoluteSlug',
    );
    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'slugs', 'relativeSlug.md'),
      '/docs/withSlugs/slugs/relativeSlug',
    );
    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'slugs', 'resolvedSlug.md'),
      '/docs/withSlugs/slugs/hey/resolvedSlug',
    );
    await testSlug(
      versionedDir,
      path.join('version-withSlugs', 'slugs', 'tryToEscapeSlug.md'),
      '/docs/withSlugs/tryToEscapeSlug',
    );
  });
});
