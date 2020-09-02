/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadContext} from '@docusaurus/core/src/server/index';
import {processDocMetadata, readVersionDocs, readDocFile} from '../docs';
import {readVersionsMetadata} from '../versions';
import {
  DocFile,
  DocMetadataBase,
  MetadataOptions,
  VersionMetadata,
} from '../types';
import {LoadContext} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';
import {DEFAULT_OPTIONS} from '../options';
import {Optional} from 'utility-types';

const fixtureDir = path.join(__dirname, '__fixtures__');

const createFakeDocFile = ({
  source,
  frontmatter = {},
  markdown = 'some markdown content',
}: {
  source: string;
  frontmatter?: Record<string, string>;
  markdown?: string;
}): DocFile => {
  const content = `---
${Object.entries(frontmatter)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}
---
${markdown}
`;
  return {
    source,
    content,
    lastUpdate: {},
  };
};

function createTestUtils({
  siteDir,
  context,
  versionMetadata,
  options,
}: {
  siteDir: string;
  context: LoadContext;
  versionMetadata: VersionMetadata;
  options: MetadataOptions;
}) {
  async function readDoc(docFileSource: string) {
    return readDocFile(versionMetadata.docsDirPath, docFileSource, options);
  }
  function processDocFile(docFile: DocFile) {
    return processDocMetadata({
      docFile,
      versionMetadata,
      options,
      context,
    });
  }
  async function testMeta(
    docFileSource: string,
    expectedMetadata: Optional<
      DocMetadataBase,
      'source' | 'lastUpdatedBy' | 'lastUpdatedAt' | 'sidebar_label' | 'editUrl'
    >,
  ) {
    const docFile = await readDoc(docFileSource);
    const metadata = await processDocMetadata({
      docFile,
      versionMetadata,
      context,
      options,
    });
    expect(metadata).toEqual({
      lastUpdatedBy: undefined,
      lastUpdatedAt: undefined,
      sidebar_label: undefined,
      editUrl: undefined,
      source: path.join(
        '@site',
        path.relative(siteDir, versionMetadata.docsDirPath),
        docFileSource,
      ),
      ...expectedMetadata,
    });
  }

  async function testSlug(docFileSource: string, expectedPermalink: string) {
    const docFile = await readDoc(docFileSource);
    const metadata = await processDocMetadata({
      docFile,
      versionMetadata,
      context,
      options,
    });
    expect(metadata.permalink).toEqual(expectedPermalink);
  }

  return {processDocFile, testMeta, testSlug};
}

describe('simple site', () => {
  const siteDir = path.join(fixtureDir, 'simple-site');
  const context = loadContext(siteDir);
  const options = {
    id: DEFAULT_PLUGIN_ID,
    ...DEFAULT_OPTIONS,
  };
  const versionsMetadata = readVersionsMetadata({
    context,
    options: {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
    },
  });
  expect(versionsMetadata.length).toEqual(1);
  const [currentVersion] = versionsMetadata;

  const defaultTestUtils = createTestUtils({
    siteDir,
    context,
    options,
    versionMetadata: currentVersion,
  });

  test('readVersionDocs', async () => {
    const docs = await readVersionDocs(currentVersion, options);
    expect(docs.map((doc) => doc.source).sort()).toEqual(
      [
        'hello.md',
        'ipsum.md',
        'lorem.md',
        'rootAbsoluteSlug.md',
        'rootRelativeSlug.md',
        'rootResolvedSlug.md',
        'rootTryToEscapeSlug.md',
        'foo/bar.md',
        'foo/baz.md',
        'slugs/absoluteSlug.md',
        'slugs/relativeSlug.md',
        'slugs/resolvedSlug.md',
        'slugs/tryToEscapeSlug.md',
      ].sort(),
    );
  });

  test('normal docs', async () => {
    await defaultTestUtils.testMeta(path.join('foo', 'bar.md'), {
      version: 'current',
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'Bar',
      description: 'This is custom description',
    });
    await defaultTestUtils.testMeta(path.join('hello.md'), {
      version: 'current',
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
    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options: {...options, homePageId: 'hello'},
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta(path.join('hello.md'), {
      version: 'current',
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
    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options: {...options, homePageId: 'foo/bar'},
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta(path.join('foo', 'bar.md'), {
      version: 'current',
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
    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options: {
        ...options,
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
      },
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta(path.join('foo', 'baz.md'), {
      version: 'current',
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
    await defaultTestUtils.testMeta('lorem.md', {
      version: 'current',
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
    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options: {
        ...options,
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta('lorem.md', {
      version: 'current',
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

  test('docs with slugs', async () => {
    await defaultTestUtils.testSlug(
      path.join('rootRelativeSlug.md'),
      '/docs/rootRelativeSlug',
    );
    await defaultTestUtils.testSlug(
      path.join('rootAbsoluteSlug.md'),
      '/docs/rootAbsoluteSlug',
    );
    await defaultTestUtils.testSlug(
      path.join('rootResolvedSlug.md'),
      '/docs/hey/rootResolvedSlug',
    );
    await defaultTestUtils.testSlug(
      path.join('rootTryToEscapeSlug.md'),
      '/docs/rootTryToEscapeSlug',
    );

    await defaultTestUtils.testSlug(
      path.join('slugs', 'absoluteSlug.md'),
      '/docs/absoluteSlug',
    );
    await defaultTestUtils.testSlug(
      path.join('slugs', 'relativeSlug.md'),
      '/docs/slugs/relativeSlug',
    );
    await defaultTestUtils.testSlug(
      path.join('slugs', 'resolvedSlug.md'),
      '/docs/slugs/hey/resolvedSlug',
    );
    await defaultTestUtils.testSlug(
      path.join('slugs', 'tryToEscapeSlug.md'),
      '/docs/tryToEscapeSlug',
    );
  });

  test('docs with invalid id', () => {
    expect(() => {
      defaultTestUtils.processDocFile(
        createFakeDocFile({
          source: 'some/fake/path',
          frontmatter: {
            id: 'Hello/world',
          },
        }),
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"Document id [Hello/world] cannot include \\"/\\"."`,
    );
  });

  test('docs with slug on doc home', async () => {
    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options: {
        ...options,
        homePageId: 'homePageId',
      },
      versionMetadata: currentVersion,
    });
    expect(() => {
      testUtilsLocal.processDocFile(
        createFakeDocFile({
          source: 'homePageId',
          frontmatter: {
            slug: '/x/y',
          },
        }),
      );
    }).toThrowErrorMatchingInlineSnapshot(
      `"The docs homepage (homePageId=homePageId) is not allowed to have a frontmatter slug=/x/y => you have to chooser either homePageId or slug, not both"`,
    );
  });
});

describe('versioned site', () => {
  const siteDir = path.join(fixtureDir, 'versioned-site');
  const context = loadContext(siteDir);
  const options = {
    id: DEFAULT_PLUGIN_ID,
    ...DEFAULT_OPTIONS,
  };
  const versionsMetadata = readVersionsMetadata({
    context,
    options: {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
    },
  });
  expect(versionsMetadata.length).toEqual(4);
  const [
    currentVersion,
    version101,
    version100,
    versionWithSlugs,
  ] = versionsMetadata;

  const currentVersionTestUtils = createTestUtils({
    siteDir,
    context,
    options,
    versionMetadata: currentVersion,
  });
  const version101TestUtils = createTestUtils({
    siteDir,
    context,
    options,
    versionMetadata: version101,
  });

  const version100TestUtils = createTestUtils({
    siteDir,
    context,
    options,
    versionMetadata: version100,
  });

  const versionWithSlugsTestUtils = createTestUtils({
    siteDir,
    context,
    options,
    versionMetadata: versionWithSlugs,
  });

  test('next docs', async () => {
    await currentVersionTestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/next/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'This is next version of bar.',
      version: 'current',
    });
    await currentVersionTestUtils.testMeta(path.join('hello.md'), {
      id: 'hello',
      unversionedId: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/next/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello next !',
      version: 'current',
    });
  });

  test('versioned docs', async () => {
    await version100TestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'version-1.0.0/foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'Bar 1.0.0 !',
      version: '1.0.0',
    });
    await version100TestUtils.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 !',
      version: '1.0.0',
    });
    await version101TestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'version-1.0.1/foo/bar',
      unversionedId: 'foo/bar',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'bar',
      description: 'Bar 1.0.1 !',
      version: '1.0.1',
    });
    await version101TestUtils.testMeta(path.join('hello.md'), {
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
    await currentVersionTestUtils.testSlug(
      path.join('slugs', 'absoluteSlug.md'),
      '/docs/next/absoluteSlug',
    );
    await currentVersionTestUtils.testSlug(
      path.join('slugs', 'relativeSlug.md'),
      '/docs/next/slugs/relativeSlug',
    );
    await currentVersionTestUtils.testSlug(
      path.join('slugs', 'resolvedSlug.md'),
      '/docs/next/slugs/hey/resolvedSlug',
    );
    await currentVersionTestUtils.testSlug(
      path.join('slugs', 'tryToEscapeSlug.md'),
      '/docs/next/tryToEscapeSlug',
    );
  });

  test('versioned doc slugs', async () => {
    await versionWithSlugsTestUtils.testSlug(
      path.join('rootAbsoluteSlug.md'),
      '/docs/withSlugs/rootAbsoluteSlug',
    );
    await versionWithSlugsTestUtils.testSlug(
      path.join('rootRelativeSlug.md'),
      '/docs/withSlugs/rootRelativeSlug',
    );
    await versionWithSlugsTestUtils.testSlug(
      path.join('rootResolvedSlug.md'),
      '/docs/withSlugs/hey/rootResolvedSlug',
    );
    await versionWithSlugsTestUtils.testSlug(
      path.join('rootTryToEscapeSlug.md'),
      '/docs/withSlugs/rootTryToEscapeSlug',
    );

    await versionWithSlugsTestUtils.testSlug(
      path.join('slugs', 'absoluteSlug.md'),
      '/docs/withSlugs/absoluteSlug',
    );
    await versionWithSlugsTestUtils.testSlug(
      path.join('slugs', 'relativeSlug.md'),
      '/docs/withSlugs/slugs/relativeSlug',
    );
    await versionWithSlugsTestUtils.testSlug(
      path.join('slugs', 'resolvedSlug.md'),
      '/docs/withSlugs/slugs/hey/resolvedSlug',
    );
    await versionWithSlugsTestUtils.testSlug(
      path.join('slugs', 'tryToEscapeSlug.md'),
      '/docs/withSlugs/tryToEscapeSlug',
    );
  });
});
