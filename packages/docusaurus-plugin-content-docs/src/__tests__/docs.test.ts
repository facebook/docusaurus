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
  PluginOptions,
  EditUrlFunction,
} from '../types';
import {LoadContext} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';
import {DEFAULT_OPTIONS} from '../options';
import {Optional} from 'utility-types';
import {posixPath} from '@docusaurus/utils';

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
    contentPath: 'docs',
    filePath: source,
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
    return readDocFile(versionMetadata, docFileSource, options);
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
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, versionMetadata.contentPath)),
        posixPath(docFileSource),
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
  async function loadSite(
    loadSiteOptions: {options: Partial<PluginOptions>} = {options: {}},
  ) {
    const siteDir = path.join(fixtureDir, 'simple-site');
    const context = await loadContext(siteDir);
    const options = {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
      ...loadSiteOptions.options,
    };
    const versionsMetadata = readVersionsMetadata({
      context,
      options,
    });
    expect(versionsMetadata.length).toEqual(1);
    const [currentVersion] = versionsMetadata;

    const defaultTestUtils = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: currentVersion,
    });
    return {
      siteDir,
      context,
      options,
      versionsMetadata,
      defaultTestUtils,
      currentVersion,
    };
  }

  test('readVersionDocs', async () => {
    const {options, currentVersion} = await loadSite();
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
        'headingAsTitle.md',
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
    const {defaultTestUtils} = await loadSite();
    await defaultTestUtils.testMeta(path.join('foo', 'bar.md'), {
      version: 'current',
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'Remarkable',
      description: 'This is custom description',
      frontMatter: {
        description: 'This is custom description',
        id: 'bar',
        title: 'Bar',
      },
    });
    await defaultTestUtils.testMeta(path.join('hello.md'), {
      version: 'current',
      id: 'hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/hello',
      slug: '/hello',
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
      frontMatter: {
        id: 'hello',
        title: 'Hello, World !',
      },
    });
  });

  test('homePageId doc', async () => {
    const {siteDir, context, options, currentVersion} = await loadSite({
      options: {homePageId: 'hello'},
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta(path.join('hello.md'), {
      version: 'current',
      id: 'hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: true,
      permalink: '/docs/',
      slug: '/',
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
      frontMatter: {
        id: 'hello',
        title: 'Hello, World !',
      },
    });
  });

  test('homePageId doc nested', async () => {
    const {siteDir, context, options, currentVersion} = await loadSite({
      options: {homePageId: 'foo/bar'},
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta(path.join('foo', 'bar.md'), {
      version: 'current',
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      isDocsHomePage: true,
      permalink: '/docs/',
      slug: '/',
      title: 'Remarkable',
      description: 'This is custom description',
      frontMatter: {
        description: 'This is custom description',
        id: 'bar',
        title: 'Bar',
      },
    });
  });

  test('docs with editUrl', async () => {
    const {siteDir, context, options, currentVersion} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
      },
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta(path.join('foo', 'baz.md'), {
      version: 'current',
      id: 'foo/baz',
      unversionedId: 'foo/baz',
      sourceDirName: 'foo',
      isDocsHomePage: false,
      permalink: '/docs/foo/bazSlug.html',
      slug: '/foo/bazSlug.html',
      title: 'baz',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/docs/foo/baz.md',
      description: 'Images',
      frontMatter: {
        id: 'baz',
        slug: 'bazSlug.html',
        title: 'baz',
      },
    });
  });

  test('docs with custom editUrl & unrelated frontmatter', async () => {
    const {defaultTestUtils} = await loadSite();

    await defaultTestUtils.testMeta('lorem.md', {
      version: 'current',
      id: 'lorem',
      unversionedId: 'lorem',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/lorem',
      slug: '/lorem',
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
      frontMatter: {
        custom_edit_url: 'https://github.com/customUrl/docs/lorem.md',
        unrelated_frontmatter: "won't be part of metadata",
      },
    });
  });

  test('docs with function editUrl', async () => {
    const hardcodedEditUrl = 'hardcoded-edit-url';

    const editUrlFunction: EditUrlFunction = jest.fn(() => hardcodedEditUrl);

    const {siteDir, context, options, currentVersion} = await loadSite({
      options: {
        editUrl: editUrlFunction,
      },
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta(path.join('foo', 'baz.md'), {
      version: 'current',
      id: 'foo/baz',
      unversionedId: 'foo/baz',
      sourceDirName: 'foo',
      isDocsHomePage: false,
      permalink: '/docs/foo/bazSlug.html',
      slug: '/foo/bazSlug.html',
      title: 'baz',
      editUrl: hardcodedEditUrl,
      description: 'Images',
      frontMatter: {
        id: 'baz',
        slug: 'bazSlug.html',
        title: 'baz',
      },
    });

    expect(editUrlFunction).toHaveBeenCalledTimes(1);
    expect(editUrlFunction).toHaveBeenCalledWith({
      version: 'current',
      versionDocsDirPath: 'docs',
      docPath: path.posix.join('foo', 'baz.md'),
      permalink: '/docs/foo/bazSlug.html',
      locale: 'en',
    });
  });

  test('docs with last update time and author', async () => {
    const {siteDir, context, options, currentVersion} = await loadSite({
      options: {
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: currentVersion,
    });

    await testUtilsLocal.testMeta('lorem.md', {
      version: 'current',
      id: 'lorem',
      unversionedId: 'lorem',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/lorem',
      slug: '/lorem',
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
      frontMatter: {
        custom_edit_url: 'https://github.com/customUrl/docs/lorem.md',
        unrelated_frontmatter: "won't be part of metadata",
      },
      lastUpdatedAt: 1539502055,
      formattedLastUpdatedAt: '10/14/2018',
      lastUpdatedBy: 'Author',
    });
  });

  test('docs with slugs', async () => {
    const {defaultTestUtils} = await loadSite();

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

  test('docs with invalid id', async () => {
    const {defaultTestUtils} = await loadSite();
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
    const {siteDir, context, options, currentVersion} = await loadSite({
      options: {
        homePageId: 'homePageId',
      },
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
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
      `"The docs homepage (homePageId=homePageId) is not allowed to have a frontmatter slug=/x/y => you have to choose either homePageId or slug, not both"`,
    );
  });
});

describe('versioned site', () => {
  async function loadSite(
    loadSiteOptions: {options: Partial<PluginOptions>; locale?: string} = {
      options: {},
    },
  ) {
    const siteDir = path.join(fixtureDir, 'versioned-site');
    const context = await loadContext(siteDir, {
      locale: loadSiteOptions.locale,
    });
    const options = {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
      ...loadSiteOptions.options,
    };
    const versionsMetadata = readVersionsMetadata({
      context,
      options,
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

    return {
      siteDir,
      context,
      options,
      versionsMetadata,
      currentVersionTestUtils,
      version101TestUtils,
      version100,
      version100TestUtils,
      versionWithSlugsTestUtils,
    };
  }

  test('next docs', async () => {
    const {currentVersionTestUtils} = await loadSite();

    await currentVersionTestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      isDocsHomePage: false,
      permalink: '/docs/next/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'This is next version of bar.',
      frontMatter: {slug: 'barSlug'},
      version: 'current',
    });
    await currentVersionTestUtils.testMeta(path.join('hello.md'), {
      id: 'hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/next/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello next !',
      frontMatter: {},
      version: 'current',
    });
  });

  test('versioned docs', async () => {
    const {version101TestUtils, version100TestUtils} = await loadSite();

    await version100TestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'version-1.0.0/foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'Bar 1.0.0 !',
      frontMatter: {slug: 'barSlug'},
      version: '1.0.0',
    });
    await version100TestUtils.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {},
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
    });
    await version101TestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'version-1.0.1/foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      isDocsHomePage: false,
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'bar',
      description: 'Bar 1.0.1 !',
      version: '1.0.1',
      frontMatter: {},
    });
    await version101TestUtils.testMeta(path.join('hello.md'), {
      id: 'version-1.0.1/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.1 !',
      version: '1.0.1',
      frontMatter: {},
    });
  });

  test('next doc slugs', async () => {
    const {currentVersionTestUtils} = await loadSite();

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
    const {versionWithSlugsTestUtils} = await loadSite();

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

  test('doc with editUrl function', async () => {
    const hardcodedEditUrl = 'hardcoded-edit-url';

    const editUrlFunction: EditUrlFunction = jest.fn(() => hardcodedEditUrl);

    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: editUrlFunction,
      },
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: version100,
    });

    await testUtilsLocal.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {},
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl: hardcodedEditUrl,
    });

    expect(editUrlFunction).toHaveBeenCalledTimes(1);
    expect(editUrlFunction).toHaveBeenCalledWith({
      version: '1.0.0',
      versionDocsDirPath: 'versioned_docs/version-1.0.0',
      docPath: path.join('hello.md'),
      permalink: '/docs/1.0.0/hello',
      locale: 'en',
    });
  });

  test('translated doc with editUrl', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
        // editCurrentVersion: true,
      },
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: version100,
    });

    await testUtilsLocal.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {},
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/versioned_docs/version-1.0.0/hello.md',
    });
  });

  test('translated en doc with editUrl and editCurrentVersion=true', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
        editCurrentVersion: true,
      },
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: version100,
    });

    await testUtilsLocal.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {},
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/docs/hello.md',
    });
  });

  test('translated fr doc with editUrl and editLocalizedFiles=true', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
        editLocalizedFiles: true,
      },
      locale: 'fr',
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: version100,
    });

    await testUtilsLocal.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/fr/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated fr)',
      frontMatter: {},
      version: '1.0.0',
      source:
        '@site/i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
    });
  });

  test('translated fr doc with editUrl and editLocalizedFiles=true + editCurrentVersion=true', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website',
        editCurrentVersion: true,
        editLocalizedFiles: true,
      },
      locale: 'fr',
    });

    const testUtilsLocal = createTestUtils({
      siteDir,
      context,
      options,
      versionMetadata: version100,
    });

    await testUtilsLocal.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      isDocsHomePage: false,
      permalink: '/fr/docs/1.0.0/hello',
      slug: '/hello',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated fr)',
      frontMatter: {},
      version: '1.0.0',
      source:
        '@site/i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/i18n/fr/docusaurus-plugin-content-docs/current/hello.md',
    });
  });
});
