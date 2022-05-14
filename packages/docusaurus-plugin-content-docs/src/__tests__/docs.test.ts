/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import {loadContext} from '@docusaurus/core/src/server/index';
import {createSlugger, posixPath, DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import {createSidebarsUtils} from '../sidebars/utils';
import {
  processDocMetadata,
  readVersionDocs,
  readDocFile,
  addDocNavigation,
  isCategoryIndex,
  type DocEnv,
} from '../docs';
import {loadSidebars} from '../sidebars';
import {readVersionsMetadata} from '../versions';
import {DEFAULT_OPTIONS} from '../options';
import type {Sidebars} from '../sidebars/types';
import type {DocFile} from '../types';
import type {
  MetadataOptions,
  PluginOptions,
  EditUrlFunction,
  DocMetadataBase,
  VersionMetadata,
  PropNavigationLink,
} from '@docusaurus/plugin-content-docs';
import type {LoadContext} from '@docusaurus/types';
import type {Optional} from 'utility-types';

jest.setTimeout(15000);

const fixtureDir = path.join(__dirname, '__fixtures__');

const createFakeDocFile = ({
  source,
  frontMatter = {},
  markdown = 'some markdown content',
}: {
  source: string;
  frontMatter?: {[key: string]: string};
  markdown?: string;
}): DocFile => {
  const content = `---
${Object.entries(frontMatter)
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

type TestUtilsArg = {
  siteDir: string;
  context: LoadContext;
  versionMetadata: VersionMetadata;
  options: MetadataOptions;
  env?: DocEnv;
};

function createTestUtils({
  siteDir,
  context,
  versionMetadata,
  options,
  env = 'production',
}: TestUtilsArg) {
  async function readDoc(docFileSource: string) {
    return readDocFile(versionMetadata, docFileSource, options);
  }
  async function processDocFile(docFileArg: DocFile | string) {
    const docFile: DocFile =
      typeof docFileArg === 'string' ? await readDoc(docFileArg) : docFileArg;

    return processDocMetadata({
      docFile,
      versionMetadata,
      options,
      context,
      env,
    });
  }

  async function testMeta(
    docFileSource: string,
    expectedMetadata: Optional<
      DocMetadataBase,
      'source' | 'lastUpdatedBy' | 'lastUpdatedAt' | 'editUrl' | 'draft'
    >,
  ) {
    const docFile = await readDoc(docFileSource);
    const metadata = await processDocFile(docFile);
    expect(metadata).toEqual({
      lastUpdatedBy: undefined,
      lastUpdatedAt: undefined,
      editUrl: undefined,
      draft: false,
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
      env,
    });
    expect(metadata.permalink).toEqual(expectedPermalink);
  }

  async function generateNavigation(docFiles: DocFile[]): Promise<{
    pagination: {
      prev?: PropNavigationLink;
      next?: PropNavigationLink;
      id: string;
    }[];
    sidebars: Sidebars;
  }> {
    const rawDocs = docFiles.map((docFile) =>
      processDocMetadata({
        docFile,
        versionMetadata,
        context,
        options,
        env: 'production',
      }),
    );
    const sidebars = await loadSidebars(versionMetadata.sidebarFilePath, {
      sidebarItemsGenerator: ({defaultSidebarItemsGenerator, ...args}) =>
        defaultSidebarItemsGenerator({...args}),
      numberPrefixParser: options.numberPrefixParser,
      docs: rawDocs,
      drafts: [],
      version: versionMetadata,
      sidebarOptions: {
        sidebarCollapsed: false,
        sidebarCollapsible: true,
      },
      categoryLabelSlugger: createSlugger(),
    });
    const sidebarsUtils = createSidebarsUtils(sidebars);

    return {
      pagination: addDocNavigation(
        rawDocs,
        sidebarsUtils,
        versionMetadata.sidebarFilePath as string,
      ).map((doc) => ({prev: doc.previous, next: doc.next, id: doc.id})),
      sidebars,
    };
  }

  return {processDocFile, testMeta, testSlug, generateNavigation};
}

describe('simple site', () => {
  async function loadSite(
    loadSiteOptions: {options: Partial<PluginOptions>} = {options: {}},
  ) {
    const siteDir = path.join(fixtureDir, 'simple-site');
    const context = await loadContext({siteDir});
    const options = {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
      ...loadSiteOptions.options,
    };
    const versionsMetadata = await readVersionsMetadata({
      context,
      options,
    });
    expect(versionsMetadata).toHaveLength(1);
    const currentVersion = versionsMetadata[0]!;

    function createTestUtilsPartial(args: Partial<TestUtilsArg>) {
      return createTestUtils({
        siteDir,
        context,
        options,
        versionMetadata: currentVersion,
        ...args,
      });
    }

    const defaultTestUtils = createTestUtilsPartial({});

    return {
      siteDir,
      context,
      options,
      versionsMetadata,
      defaultTestUtils,
      createTestUtilsPartial,
      currentVersion,
    };
  }

  it('readVersionDocs', async () => {
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
        'doc with space.md',
        'doc-draft.md',
        'foo/bar.md',
        'foo/baz.md',
        'slugs/absoluteSlug.md',
        'slugs/relativeSlug.md',
        'slugs/resolvedSlug.md',
        'slugs/tryToEscapeSlug.md',
      ].sort(),
    );
  });

  it('normal docs', async () => {
    const {defaultTestUtils} = await loadSite();
    await defaultTestUtils.testMeta(path.join('foo', 'bar.md'), {
      version: 'current',
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'Bar',
      description: 'This is custom description',
      frontMatter: {
        description: 'This is custom description',
        id: 'bar',
        title: 'Bar',
        pagination_next: null,
        pagination_prev: null,
      },
      tags: [],
    });
    await defaultTestUtils.testMeta(path.join('hello.md'), {
      version: 'current',
      id: 'hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      permalink: '/docs/',
      slug: '/',
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
      frontMatter: {
        id: 'hello',
        title: 'Hello, World !',
        sidebar_label: 'Hello sidebar_label',
        slug: '/',
        tags: ['tag-1', 'tag 3'],
      },
      tags: [
        {
          label: 'tag-1',
          permalink: '/docs/tags/tag-1',
        },
        {
          label: 'tag 3',
          permalink: '/docs/tags/tag-3',
        },
      ],
    });
  });

  it('docs with editUrl', async () => {
    const {siteDir, context, options, currentVersion, createTestUtilsPartial} =
      await loadSite({
        options: {
          editUrl: 'https://github.com/facebook/docusaurus/edit/main/website',
        },
      });

    const testUtilsLocal = createTestUtilsPartial({
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
      permalink: '/docs/foo/bazSlug.html',
      slug: '/foo/bazSlug.html',
      title: 'baz',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/main/website/docs/foo/baz.md',
      description: 'Images',
      frontMatter: {
        id: 'baz',
        slug: 'bazSlug.html',
        title: 'baz',
        pagination_label: 'baz pagination_label',
        tags: [
          'tag 1',
          'tag-1',
          {label: 'tag 2', permalink: 'tag2-custom-permalink'},
        ],
      },
      tags: [
        {
          label: 'tag 1',
          permalink: '/docs/tags/tag-1',
        },
        {
          label: 'tag 2',
          permalink: '/docs/tags/tag2-custom-permalink',
        },
      ],
    });
  });

  it('docs with custom editUrl & unrelated frontMatter', async () => {
    const {defaultTestUtils} = await loadSite();

    await defaultTestUtils.testMeta('lorem.md', {
      version: 'current',
      id: 'lorem',
      unversionedId: 'lorem',
      sourceDirName: '.',
      permalink: '/docs/lorem',
      slug: '/lorem',
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
      frontMatter: {
        custom_edit_url: 'https://github.com/customUrl/docs/lorem.md',
        unrelated_front_matter: "won't be part of metadata",
      },
      tags: [],
    });
  });

  it('docs with function editUrl', async () => {
    const hardcodedEditUrl = 'hardcoded-edit-url';

    const editUrlFunction: EditUrlFunction = jest.fn(() => hardcodedEditUrl);

    const {siteDir, context, options, currentVersion, createTestUtilsPartial} =
      await loadSite({
        options: {
          editUrl: editUrlFunction,
        },
      });

    const testUtilsLocal = createTestUtilsPartial({
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
      permalink: '/docs/foo/bazSlug.html',
      slug: '/foo/bazSlug.html',
      title: 'baz',
      editUrl: hardcodedEditUrl,
      description: 'Images',
      frontMatter: {
        id: 'baz',
        slug: 'bazSlug.html',
        title: 'baz',
        pagination_label: 'baz pagination_label',
        tags: [
          'tag 1',
          'tag-1',
          {label: 'tag 2', permalink: 'tag2-custom-permalink'},
        ],
      },
      tags: [
        {
          label: 'tag 1',
          permalink: '/docs/tags/tag-1',
        },
        {
          label: 'tag 2',
          permalink: '/docs/tags/tag2-custom-permalink',
        },
      ],
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

  it('docs with last update time and author', async () => {
    const {siteDir, context, options, currentVersion, createTestUtilsPartial} =
      await loadSite({
        options: {
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
      });

    const testUtilsLocal = createTestUtilsPartial({
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
      permalink: '/docs/lorem',
      slug: '/lorem',
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
      frontMatter: {
        custom_edit_url: 'https://github.com/customUrl/docs/lorem.md',
        unrelated_front_matter: "won't be part of metadata",
      },
      lastUpdatedAt: 1539502055,
      formattedLastUpdatedAt: '10/14/2018',
      lastUpdatedBy: 'Author',
      tags: [],
    });
  });

  it('docs with draft frontmatter', async () => {
    const {createTestUtilsPartial} = await loadSite();

    const testUtilsProd = createTestUtilsPartial({
      env: 'production',
    });
    await expect(
      testUtilsProd.processDocFile('doc-draft.md'),
    ).resolves.toMatchObject({
      draft: true,
    });

    const testUtilsDev = createTestUtilsPartial({
      env: 'development',
    });
    await expect(
      testUtilsDev.processDocFile('doc-draft.md'),
    ).resolves.toMatchObject({
      draft: false,
    });
  });

  it('docs with slugs', async () => {
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

  it('docs with invalid id', async () => {
    const {defaultTestUtils} = await loadSite();
    await expect(async () =>
      defaultTestUtils.processDocFile(
        createFakeDocFile({
          source: 'some/fake/path',
          frontMatter: {
            id: 'Hello/world',
          },
        }),
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Document id "Hello/world" cannot include slash."`,
    );
  });

  it('custom pagination', async () => {
    const {defaultTestUtils, options, versionsMetadata} = await loadSite();
    const docs = await readVersionDocs(versionsMetadata[0]!, options);
    await expect(
      defaultTestUtils.generateNavigation(docs),
    ).resolves.toMatchSnapshot();
  });

  it('bad pagination', async () => {
    const {defaultTestUtils, options, versionsMetadata} = await loadSite();
    const docs = await readVersionDocs(versionsMetadata[0]!, options);
    docs.push(
      createFakeDocFile({
        source: 'bad',
        frontMatter: {pagination_prev: 'nonexistent'},
      }),
    );
    await expect(
      defaultTestUtils.generateNavigation(docs),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Error when loading bad in .: the pagination_prev front matter points to a non-existent ID nonexistent."`,
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
    const context = await loadContext({
      siteDir,
      locale: loadSiteOptions.locale,
    });
    const options = {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
      ...loadSiteOptions.options,
    };
    const versionsMetadata = await readVersionsMetadata({
      context,
      options,
    });
    expect(versionsMetadata).toHaveLength(4);

    const currentVersion = versionsMetadata[0]!;
    const version101 = versionsMetadata[1]!;
    const version100 = versionsMetadata[2]!;
    const versionWithSlugs = versionsMetadata[3]!;

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

  it('next docs', async () => {
    const {currentVersionTestUtils} = await loadSite();

    await currentVersionTestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'foo/bar',
      version: 'current',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      permalink: '/docs/next/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'This is next version of bar.',
      frontMatter: {
        slug: 'barSlug',
        tags: [
          'barTag 1',
          'barTag-2',
          {
            label: 'barTag 3',
            permalink: 'barTag-3-permalink',
          },
        ],
      },
      tags: [
        {
          label: 'barTag 1',
          permalink: '/docs/next/tags/bar-tag-1',
        },
        {
          label: 'barTag-2',
          permalink: '/docs/next/tags/bar-tag-2',
        },
        {
          label: 'barTag 3',
          permalink: '/docs/next/tags/barTag-3-permalink',
        },
      ],
    });
    await currentVersionTestUtils.testMeta(path.join('hello.md'), {
      id: 'hello',
      version: 'current',
      unversionedId: 'hello',
      sourceDirName: '.',
      permalink: '/docs/next/',
      slug: '/',
      title: 'hello',
      description: 'Hello next !',
      frontMatter: {
        slug: '/',
      },
      tags: [],
    });
  });

  it('versioned docs', async () => {
    const {version101TestUtils, version100TestUtils} = await loadSite();

    await version100TestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'version-1.0.0/foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      permalink: '/docs/1.0.0/foo/barSlug',
      slug: '/foo/barSlug',
      title: 'bar',
      description: 'Bar 1.0.0 !',
      frontMatter: {slug: 'barSlug'},
      version: '1.0.0',
      tags: [],
    });
    await version100TestUtils.testMeta(path.join('hello.md'), {
      id: 'version-1.0.0/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      permalink: '/docs/1.0.0/',
      slug: '/',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {
        slug: '/',
      },
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      tags: [],
    });
    await version101TestUtils.testMeta(path.join('foo', 'bar.md'), {
      id: 'version-1.0.1/foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      title: 'bar',
      description: 'Bar 1.0.1 !',
      version: '1.0.1',
      frontMatter: {},
      tags: [],
    });
    await version101TestUtils.testMeta(path.join('hello.md'), {
      id: 'version-1.0.1/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      permalink: '/docs/',
      slug: '/',
      title: 'hello',
      description: 'Hello 1.0.1 !',
      version: '1.0.1',
      frontMatter: {
        slug: '/',
      },
      tags: [],
    });
  });

  it('next doc slugs', async () => {
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

  it('versioned doc slugs', async () => {
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

  it('doc with editUrl function', async () => {
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
      permalink: '/docs/1.0.0/',
      slug: '/',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {
        slug: '/',
      },
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl: hardcodedEditUrl,
      tags: [],
    });

    expect(editUrlFunction).toHaveBeenCalledTimes(1);
    expect(editUrlFunction).toHaveBeenCalledWith({
      version: '1.0.0',
      versionDocsDirPath: 'versioned_docs/version-1.0.0',
      docPath: path.join('hello.md'),
      permalink: '/docs/1.0.0/',
      locale: 'en',
    });
  });

  it('translated doc with editUrl', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/main/website',
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
      permalink: '/docs/1.0.0/',
      slug: '/',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {
        slug: '/',
      },
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/main/website/versioned_docs/version-1.0.0/hello.md',
      tags: [],
    });
  });

  it('translated en doc with editUrl and editCurrentVersion=true', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/main/website',
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
      permalink: '/docs/1.0.0/',
      slug: '/',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated en)',
      frontMatter: {
        slug: '/',
      },
      version: '1.0.0',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/main/website/docs/hello.md',
      tags: [],
    });
  });

  it('translated fr doc with editUrl and editLocalizedFiles=true', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/main/website',
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
      permalink: '/fr/docs/1.0.0/',
      slug: '/',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated fr)',
      frontMatter: {
        slug: '/',
      },
      version: '1.0.0',
      source:
        '@site/i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/main/website/i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      tags: [],
    });
  });

  it('translated fr doc with editUrl and editLocalizedFiles=true + editCurrentVersion=true', async () => {
    const {siteDir, context, options, version100} = await loadSite({
      options: {
        editUrl: 'https://github.com/facebook/docusaurus/edit/main/website',
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
      permalink: '/fr/docs/1.0.0/',
      slug: '/',
      title: 'hello',
      description: 'Hello 1.0.0 ! (translated fr)',
      frontMatter: {
        slug: '/',
      },
      version: '1.0.0',
      source:
        '@site/i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/hello.md',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/main/website/i18n/fr/docusaurus-plugin-content-docs/current/hello.md',
      tags: [],
    });
  });
});

describe('isConventionalDocIndex', () => {
  it('supports readme', () => {
    expect(
      isCategoryIndex({
        fileName: 'readme',
        directories: ['doesNotMatter'],
        extension: '.md',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'readme',
        directories: ['doesNotMatter'],
        extension: '.mdx',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'README',
        directories: ['doesNotMatter'],
        extension: '.md',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'ReAdMe',
        directories: ['doesNotMatter'],
        extension: '',
      }),
    ).toBe(true);
  });

  it('supports index', () => {
    expect(
      isCategoryIndex({
        fileName: 'index',
        directories: ['doesNotMatter'],
        extension: '.md',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'index',
        directories: ['doesNotMatter'],
        extension: '.mdx',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'INDEX',
        directories: ['doesNotMatter'],
        extension: '.md',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'InDeX',
        directories: ['doesNotMatter'],
        extension: '',
      }),
    ).toBe(true);
  });

  it('supports <categoryName>/<categoryName>.md', () => {
    expect(
      isCategoryIndex({
        fileName: 'someCategory',
        directories: ['someCategory', 'doesNotMatter'],
        extension: '',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'someCategory',
        directories: ['someCategory'],
        extension: '.md',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'someCategory',
        directories: ['someCategory'],
        extension: '.mdx',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'SOME_CATEGORY',
        directories: ['some_category'],
        extension: '.md',
      }),
    ).toBe(true);
    expect(
      isCategoryIndex({
        fileName: 'some_category',
        directories: ['some_category'],
        extension: '',
      }),
    ).toBe(true);
  });

  it('reject other cases', () => {
    expect(
      isCategoryIndex({
        fileName: 'some_Category',
        directories: ['someCategory'],
        extension: '',
      }),
    ).toBe(false);
    expect(
      isCategoryIndex({
        fileName: 'read_me',
        directories: ['doesNotMatter'],
        extension: '',
      }),
    ).toBe(false);
    expect(
      isCategoryIndex({
        fileName: 'the index',
        directories: ['doesNotMatter'],
        extension: '',
      }),
    ).toBe(false);
  });
});
