/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {isMatch} from 'picomatch';
import commander from 'commander';
import {kebabCase, orderBy} from 'lodash';

import fs from 'fs-extra';
import pluginContentDocs from '../index';
import {loadContext} from '@docusaurus/core/src/server/index';
import {applyConfigureWebpack} from '@docusaurus/core/src/webpack/utils';
import type {RouteConfig} from '@docusaurus/types';
import {posixPath, DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import {sortConfig} from '@docusaurus/core/src/server/plugins';

import * as cliDocs from '../cli';
import {OptionsSchema} from '../options';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import type {DocMetadata, LoadedVersion} from '../types';
import type {
  SidebarItem,
  SidebarItemsGeneratorOption,
  SidebarItemsGeneratorOptionArgs,
} from '../sidebars/types';
import {toSidebarsProp} from '../props';

import {validate} from 'webpack';
import {DefaultSidebarItemsGenerator} from '../sidebars/generator';
import {DisabledSidebars} from '../sidebars';

function findDocById(version: LoadedVersion, unversionedId: string) {
  return version.docs.find((item) => item.unversionedId === unversionedId);
}
function getDocById(version: LoadedVersion, unversionedId: string) {
  const doc = findDocById(version, unversionedId);
  if (!doc) {
    throw new Error(
      `No doc found with id "${unversionedId}" in version ${
        version.versionName
      }.
Available ids are:\n- ${version.docs.map((d) => d.unversionedId).join('\n- ')}`,
    );
  }
  return doc;
}

const defaultDocMetadata: Partial<DocMetadata> = {
  next: undefined,
  previous: undefined,
  editUrl: undefined,
  lastUpdatedAt: undefined,
  lastUpdatedBy: undefined,
  formattedLastUpdatedAt: undefined,
  tags: [],
};

const createFakeActions = (contentDir: string) => {
  const routeConfigs: RouteConfig[] = [];
  const dataContainer: Record<string, unknown> = {};
  const globalDataContainer: {pluginName?: {pluginId: unknown}} = {};

  const actions = {
    addRoute: (config: RouteConfig) => {
      routeConfigs.push(config);
    },
    createData: async (name: string, content: unknown) => {
      dataContainer[name] = content;
      return path.join(contentDir, name);
    },
    setGlobalData: (data: unknown) => {
      globalDataContainer.pluginName = {pluginId: data};
    },
  };

  // query by prefix, because files have a hash at the end
  // so it's not convenient to query by full filename
  const getCreatedDataByPrefix = (prefix: string) => {
    const entry = Object.entries(dataContainer).find(([key]) =>
      key.startsWith(prefix),
    );
    if (!entry) {
      throw new Error(`No created entry found for prefix "${prefix}".
Entries created:
- ${Object.keys(dataContainer).join('\n- ')}
        `);
    }
    return JSON.parse(entry[1] as string);
  };

  // Extra fns useful for tests!
  const utils = {
    getGlobalData: () => globalDataContainer,
    getRouteConfigs: () => routeConfigs,

    checkVersionMetadataPropCreated: (version: LoadedVersion) => {
      const versionMetadataProp = getCreatedDataByPrefix(
        `version-${kebabCase(version.versionName)}-metadata-prop`,
      );
      expect(versionMetadataProp.docsSidebars).toEqual(toSidebarsProp(version));
    },

    expectSnapshot: () => {
      // Sort the route config like in src/server/plugins/index.ts for consistent snapshot ordering
      sortConfig(routeConfigs);
      expect(routeConfigs).not.toEqual([]);
      expect(routeConfigs).toMatchSnapshot('route config');
      expect(dataContainer).toMatchSnapshot('data');
      expect(globalDataContainer).toMatchSnapshot('global data');
    },
  };

  return {
    actions,
    utils,
  };
};

describe('sidebar', () => {
  test('site with wrong sidebar content', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
    const context = await loadContext(siteDir);
    const sidebarPath = path.join(siteDir, 'wrong-sidebars.json');
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        sidebarPath,
      }),
    );
    await expect(plugin.loadContent!()).rejects.toThrowErrorMatchingSnapshot();
  });

  test('site with wrong sidebar file path', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-doc-label');
    const context = await loadContext(siteDir);

    await expect(async () => {
      const plugin = pluginContentDocs(
        context,
        normalizePluginOptions(OptionsSchema, {
          sidebarPath: 'wrong-path-sidebar.json',
        }),
      );
      await plugin.loadContent!();
    }).rejects.toThrowErrorMatchingInlineSnapshot(`
            "The path to the sidebar file does not exist at \\"wrong-path-sidebar.json\\".
            Please set the docs \\"sidebarPath\\" field in your config file to:
            - a sidebars path that exists
            - false: to disable the sidebar
            - undefined: for Docusaurus generates it automatically"
          `);
  });

  test('site with undefined sidebar', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-doc-label');
    const context = await loadContext(siteDir);
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        sidebarPath: undefined,
      }),
    );
    const result = await plugin.loadContent!();

    expect(result.loadedVersions).toHaveLength(1);
    expect(result.loadedVersions[0].sidebars).toMatchInlineSnapshot(`
          Object {
            "defaultSidebar": Array [
              Object {
                "id": "hello-1",
                "type": "doc",
              },
              Object {
                "id": "hello-2",
                "label": "Hello 2 From Doc",
                "type": "doc",
              },
            ],
          }
      `);
  });

  test('site with disabled sidebar', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-doc-label');
    const context = await loadContext(siteDir);
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        sidebarPath: false,
      }),
    );
    const result = await plugin.loadContent!();

    expect(result.loadedVersions).toHaveLength(1);
    expect(result.loadedVersions[0].sidebars).toEqual(DisabledSidebars);
  });
});

describe('empty/no docs website', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'empty-site');

  test('no files in docs folder', async () => {
    const context = await loadContext(siteDir);
    await fs.ensureDir(path.join(siteDir, 'docs'));
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {}),
    );
    await expect(
      plugin.loadContent!(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Docs version \\"current\\" has no docs! At least one doc should exist at \\"docs\\"."`,
    );
  });

  test('docs folder does not exist', async () => {
    const context = await loadContext(siteDir);
    expect(() =>
      pluginContentDocs(
        context,
        normalizePluginOptions(OptionsSchema, {
          path: `path/doesnt/exist`,
        }),
      ),
    ).toThrowError(
      `The docs folder does not exist for version "current". A docs folder is expected to be found at ${
        process.platform === 'win32'
          ? 'path\\doesnt\\exist'
          : 'path/doesnt/exist'
      }.`,
    );
  });
});

describe('simple website', () => {
  async function loadSite() {
    const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
    const context = await loadContext(siteDir);
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        path: 'docs',
        sidebarPath,
      }),
    );
    const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);

    return {siteDir, context, sidebarPath, plugin, pluginContentDir};
  }

  test('extendCli - docsVersion', async () => {
    const {siteDir, sidebarPath, plugin} = await loadSite();
    const mock = jest
      .spyOn(cliDocs, 'cliDocsVersionCommand')
      .mockImplementation();
    const cli = new commander.Command();
    // @ts-expect-error: TODO annoying type incompatibility
    plugin.extendCli!(cli);
    cli.parse(['node', 'test', 'docs:version', '1.0.0']);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('1.0.0', siteDir, DEFAULT_PLUGIN_ID, {
      path: 'docs',
      sidebarPath,
      sidebarCollapsed: true,
      sidebarCollapsible: true,
    });
    mock.mockRestore();
  });

  test('getPathToWatch', async () => {
    const {siteDir, plugin} = await loadSite();

    const pathToWatch = plugin.getPathsToWatch!();
    const matchPattern = pathToWatch.map((filepath) =>
      posixPath(path.relative(siteDir, filepath)),
    );
    expect(matchPattern).not.toEqual([]);
    expect(matchPattern).toMatchInlineSnapshot(`
      Array [
        "sidebars.json",
        "i18n/en/docusaurus-plugin-content-docs/current/**/*.{md,mdx}",
        "docs/**/*.{md,mdx}",
        "docs/**/_category_.{json,yml,yaml}",
      ]
    `);
    expect(isMatch('docs/hello.md', matchPattern)).toEqual(true);
    expect(isMatch('docs/hello.mdx', matchPattern)).toEqual(true);
    expect(isMatch('docs/foo/bar.md', matchPattern)).toEqual(true);
    expect(isMatch('docs/hello.js', matchPattern)).toEqual(false);
    expect(isMatch('docs/super.mdl', matchPattern)).toEqual(false);
    expect(isMatch('docs/mdx', matchPattern)).toEqual(false);
    expect(isMatch('docs/headingAsTitle.md', matchPattern)).toEqual(true);
    expect(isMatch('sidebars.json', matchPattern)).toEqual(true);
    expect(isMatch('versioned_docs/hello.md', matchPattern)).toEqual(false);
    expect(isMatch('hello.md', matchPattern)).toEqual(false);
    expect(isMatch('super/docs/hello.md', matchPattern)).toEqual(false);
  });

  test('configureWebpack', async () => {
    const {plugin} = await loadSite();

    const content = await plugin.loadContent?.();

    const config = applyConfigureWebpack(
      plugin.configureWebpack,
      {
        entry: './src/index.js',
        output: {
          filename: 'main.js',
          path: path.resolve(__dirname, 'dist'),
        },
      },
      false,
      undefined,
      content,
    );
    const errors = validate(config);
    expect(errors).toBeUndefined();
  });

  test('content', async () => {
    const {siteDir, plugin, pluginContentDir} = await loadSite();
    const content = await plugin.loadContent!();
    expect(content.loadedVersions.length).toEqual(1);
    const [currentVersion] = content.loadedVersions;

    expect(findDocById(currentVersion, 'foo/baz')).toEqual({
      ...defaultDocMetadata,
      version: 'current',
      id: 'foo/baz',
      unversionedId: 'foo/baz',
      sourceDirName: 'foo',
      permalink: '/docs/foo/bazSlug.html',
      slug: '/foo/bazSlug.html',
      previous: {
        title: 'Bar',
        permalink: '/docs/foo/bar',
      },
      next: {
        title: 'rootAbsoluteSlug',
        permalink: '/docs/rootAbsoluteSlug',
      },
      sidebar: 'docs',
      sidebarPosition: undefined,
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, currentVersion.contentPath)),
        'foo',
        'baz.md',
      ),
      title: 'baz',
      description: 'Images',
      frontMatter: {
        id: 'baz',
        title: 'baz',
        slug: 'bazSlug.html',
        pagination_label: 'baz pagination_label',
        tags: [
          'tag 1',
          'tag-1', // This one will be de-duplicated as it would lead to the same permalink as the first
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

    expect(findDocById(currentVersion, 'hello')).toEqual({
      ...defaultDocMetadata,
      version: 'current',
      id: 'hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      permalink: '/docs/',
      slug: '/',
      previous: {
        title: 'My heading as title',
        permalink: '/docs/headingAsTitle',
      },
      sidebar: 'docs',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, currentVersion.contentPath)),
        'hello.md',
      ),
      title: 'Hello, World !',
      description: 'Hi, Endilie here :)',
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

    expect(getDocById(currentVersion, 'foo/bar')).toEqual({
      ...defaultDocMetadata,
      version: 'current',
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      next: {
        title: 'baz pagination_label',
        permalink: '/docs/foo/bazSlug.html',
      },
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      sidebar: 'docs',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, currentVersion.contentPath)),
        'foo',
        'bar.md',
      ),
      title: 'Bar',
      description: 'This is custom description',
      frontMatter: {
        description: 'This is custom description',
        id: 'bar',
        title: 'Bar',
      },
    });

    expect(currentVersion.sidebars).toMatchSnapshot();

    const {actions, utils} = createFakeActions(pluginContentDir);

    await plugin.contentLoaded!({
      content,
      actions,
      allContent: {},
    });

    utils.checkVersionMetadataPropCreated(currentVersion);

    utils.expectSnapshot();

    expect(utils.getGlobalData()).toMatchSnapshot();
  });
});

describe('versioned website', () => {
  async function loadSite() {
    const siteDir = path.join(__dirname, '__fixtures__', 'versioned-site');
    const context = await loadContext(siteDir);
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const routeBasePath = 'docs';
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        routeBasePath,
        sidebarPath,
      }),
    );
    const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);
    return {
      siteDir,
      context,
      routeBasePath,
      sidebarPath,
      plugin,
      pluginContentDir,
    };
  }

  test('extendCli - docsVersion', async () => {
    const {siteDir, routeBasePath, sidebarPath, plugin} = await loadSite();
    const mock = jest
      .spyOn(cliDocs, 'cliDocsVersionCommand')
      .mockImplementation();
    const cli = new commander.Command();
    // @ts-expect-error: TODO annoying type incompatibility
    plugin.extendCli!(cli);
    cli.parse(['node', 'test', 'docs:version', '2.0.0']);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('2.0.0', siteDir, DEFAULT_PLUGIN_ID, {
      path: routeBasePath,
      sidebarPath,
      sidebarCollapsed: true,
      sidebarCollapsible: true,
    });
    mock.mockRestore();
  });

  test('getPathToWatch', async () => {
    const {siteDir, plugin} = await loadSite();
    const pathToWatch = plugin.getPathsToWatch!();
    const matchPattern = pathToWatch.map((filepath) =>
      posixPath(path.relative(siteDir, filepath)),
    );
    expect(matchPattern).not.toEqual([]);
    expect(matchPattern).toMatchInlineSnapshot(`
      Array [
        "sidebars.json",
        "i18n/en/docusaurus-plugin-content-docs/current/**/*.{md,mdx}",
        "docs/**/*.{md,mdx}",
        "docs/**/_category_.{json,yml,yaml}",
        "versioned_sidebars/version-1.0.1-sidebars.json",
        "i18n/en/docusaurus-plugin-content-docs/version-1.0.1/**/*.{md,mdx}",
        "versioned_docs/version-1.0.1/**/*.{md,mdx}",
        "versioned_docs/version-1.0.1/**/_category_.{json,yml,yaml}",
        "versioned_sidebars/version-1.0.0-sidebars.json",
        "i18n/en/docusaurus-plugin-content-docs/version-1.0.0/**/*.{md,mdx}",
        "versioned_docs/version-1.0.0/**/*.{md,mdx}",
        "versioned_docs/version-1.0.0/**/_category_.{json,yml,yaml}",
        "versioned_sidebars/version-withSlugs-sidebars.json",
        "i18n/en/docusaurus-plugin-content-docs/version-withSlugs/**/*.{md,mdx}",
        "versioned_docs/version-withSlugs/**/*.{md,mdx}",
        "versioned_docs/version-withSlugs/**/_category_.{json,yml,yaml}",
      ]
    `);
    expect(isMatch('docs/hello.md', matchPattern)).toEqual(true);
    expect(isMatch('docs/hello.mdx', matchPattern)).toEqual(true);
    expect(isMatch('docs/foo/bar.md', matchPattern)).toEqual(true);
    expect(isMatch('sidebars.json', matchPattern)).toEqual(true);
    expect(
      isMatch('versioned_docs/version-1.0.0/hello.md', matchPattern),
    ).toEqual(true);
    expect(
      isMatch('versioned_docs/version-1.0.0/foo/bar.md', matchPattern),
    ).toEqual(true);
    expect(
      isMatch('versioned_sidebars/version-1.0.0-sidebars.json', matchPattern),
    ).toEqual(true);

    // Non existing version
    expect(
      isMatch('versioned_docs/version-2.0.0/foo/bar.md', matchPattern),
    ).toEqual(false);
    expect(
      isMatch('versioned_docs/version-2.0.0/hello.md', matchPattern),
    ).toEqual(false);
    expect(
      isMatch('versioned_sidebars/version-2.0.0-sidebars.json', matchPattern),
    ).toEqual(false);

    expect(isMatch('docs/hello.js', matchPattern)).toEqual(false);
    expect(isMatch('docs/super.mdl', matchPattern)).toEqual(false);
    expect(isMatch('docs/mdx', matchPattern)).toEqual(false);
    expect(isMatch('hello.md', matchPattern)).toEqual(false);
    expect(isMatch('super/docs/hello.md', matchPattern)).toEqual(false);
  });

  test('content', async () => {
    const {siteDir, plugin, pluginContentDir} = await loadSite();
    const content = await plugin.loadContent!();
    expect(content.loadedVersions.length).toEqual(4);
    const [currentVersion, version101, version100, versionWithSlugs] =
      content.loadedVersions;

    // foo/baz.md only exists in version -1.0.0
    expect(findDocById(currentVersion, 'foo/baz')).toBeUndefined();
    expect(findDocById(version101, 'foo/baz')).toBeUndefined();
    expect(findDocById(versionWithSlugs, 'foo/baz')).toBeUndefined();

    expect(getDocById(currentVersion, 'foo/bar')).toEqual({
      ...defaultDocMetadata,
      id: 'foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      permalink: '/docs/next/foo/barSlug',
      slug: '/foo/barSlug',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, currentVersion.contentPath)),
        'foo',
        'bar.md',
      ),
      title: 'bar',
      description: 'This is next version of bar.',
      frontMatter: {
        slug: 'barSlug',
        tags: [
          'barTag 1',
          'barTag-2',
          {label: 'barTag 3', permalink: 'barTag-3-permalink'},
        ],
      },
      version: 'current',
      sidebar: 'docs',
      next: {
        title: 'hello',
        permalink: '/docs/next/',
      },
      tags: [
        {label: 'barTag 1', permalink: '/docs/next/tags/bar-tag-1'},
        {label: 'barTag-2', permalink: '/docs/next/tags/bar-tag-2'},
        {label: 'barTag 3', permalink: '/docs/next/tags/barTag-3-permalink'},
      ],
    });
    expect(getDocById(version101, 'foo/bar')).toEqual({
      ...defaultDocMetadata,
      id: 'version-1.0.1/foo/bar',
      unversionedId: 'foo/bar',
      sourceDirName: 'foo',
      permalink: '/docs/foo/bar',
      slug: '/foo/bar',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version101.contentPath)),
        'foo',
        'bar.md',
      ),
      title: 'bar',
      description: 'Bar 1.0.1 !',
      frontMatter: {},
      version: '1.0.1',
      sidebar: 'VersionedSideBarNameDoesNotMatter/docs',
      next: {
        title: 'hello',
        permalink: '/docs/',
      },
      tags: [],
    });

    expect(getDocById(currentVersion, 'hello')).toEqual({
      ...defaultDocMetadata,
      id: 'hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      permalink: '/docs/next/',
      slug: '/',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, currentVersion.contentPath)),
        'hello.md',
      ),
      title: 'hello',
      description: 'Hello next !',
      frontMatter: {
        slug: '/',
      },
      version: 'current',
      sidebar: 'docs',
      previous: {
        title: 'bar',
        permalink: '/docs/next/foo/barSlug',
      },
    });
    expect(getDocById(version101, 'hello')).toEqual({
      ...defaultDocMetadata,
      id: 'version-1.0.1/hello',
      unversionedId: 'hello',
      sourceDirName: '.',
      permalink: '/docs/',
      slug: '/',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version101.contentPath)),
        'hello.md',
      ),
      title: 'hello',
      description: 'Hello 1.0.1 !',
      frontMatter: {
        slug: '/',
      },
      version: '1.0.1',
      sidebar: 'VersionedSideBarNameDoesNotMatter/docs',
      previous: {
        title: 'bar',
        permalink: '/docs/foo/bar',
      },
    });
    expect(getDocById(version100, 'foo/baz')).toEqual({
      ...defaultDocMetadata,
      id: 'version-1.0.0/foo/baz',
      unversionedId: 'foo/baz',
      sourceDirName: 'foo',
      permalink: '/docs/1.0.0/foo/baz',
      slug: '/foo/baz',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version100.contentPath)),
        'foo',
        'baz.md',
      ),
      title: 'baz',
      description:
        'Baz 1.0.0 ! This will be deleted in next subsequent versions.',
      frontMatter: {},
      version: '1.0.0',
      sidebar: 'version-1.0.0/docs',
      next: {
        title: 'hello',
        permalink: '/docs/1.0.0/',
      },
      previous: {
        title: 'bar',
        permalink: '/docs/1.0.0/foo/barSlug',
      },
    });

    expect(currentVersion.sidebars).toMatchSnapshot('current version sidebars');
    expect(version101.sidebars).toMatchSnapshot('101 version sidebars');
    expect(version100.sidebars).toMatchSnapshot('100 version sidebars');
    expect(versionWithSlugs.sidebars).toMatchSnapshot(
      'withSlugs version sidebars',
    );

    const {actions, utils} = createFakeActions(pluginContentDir);
    await plugin.contentLoaded!({
      content,
      actions,
      allContent: {},
    });

    utils.checkVersionMetadataPropCreated(currentVersion);
    utils.checkVersionMetadataPropCreated(version101);
    utils.checkVersionMetadataPropCreated(version100);
    utils.checkVersionMetadataPropCreated(versionWithSlugs);

    utils.expectSnapshot();
  });
});

describe('versioned website (community)', () => {
  async function loadSite() {
    const siteDir = path.join(__dirname, '__fixtures__', 'versioned-site');
    const context = await loadContext(siteDir);
    const sidebarPath = path.join(siteDir, 'community_sidebars.json');
    const routeBasePath = 'community';
    const pluginId = 'community';
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        id: 'community',
        path: 'community',
        routeBasePath,
        sidebarPath,
      }),
    );
    const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);
    return {
      siteDir,
      context,
      routeBasePath,
      sidebarPath,
      pluginId,
      plugin,
      pluginContentDir,
    };
  }

  test('extendCli - docsVersion', async () => {
    const {siteDir, routeBasePath, sidebarPath, pluginId, plugin} =
      await loadSite();
    const mock = jest
      .spyOn(cliDocs, 'cliDocsVersionCommand')
      .mockImplementation();
    const cli = new commander.Command();
    // @ts-expect-error: TODO annoying type incompatibility
    plugin.extendCli!(cli);
    cli.parse(['node', 'test', `docs:version:${pluginId}`, '2.0.0']);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith('2.0.0', siteDir, pluginId, {
      path: routeBasePath,
      sidebarPath,
      sidebarCollapsed: true,
      sidebarCollapsible: true,
    });
    mock.mockRestore();
  });

  test('getPathToWatch', async () => {
    const {siteDir, plugin} = await loadSite();
    const pathToWatch = plugin.getPathsToWatch!();
    const matchPattern = pathToWatch.map((filepath) =>
      posixPath(path.relative(siteDir, filepath)),
    );
    expect(matchPattern).not.toEqual([]);
    expect(matchPattern).toMatchInlineSnapshot(`
      Array [
        "community_sidebars.json",
        "i18n/en/docusaurus-plugin-content-docs-community/current/**/*.{md,mdx}",
        "community/**/*.{md,mdx}",
        "community/**/_category_.{json,yml,yaml}",
        "community_versioned_sidebars/version-1.0.0-sidebars.json",
        "i18n/en/docusaurus-plugin-content-docs-community/version-1.0.0/**/*.{md,mdx}",
        "community_versioned_docs/version-1.0.0/**/*.{md,mdx}",
        "community_versioned_docs/version-1.0.0/**/_category_.{json,yml,yaml}",
      ]
    `);
    expect(isMatch('community/team.md', matchPattern)).toEqual(true);
    expect(
      isMatch('community_versioned_docs/version-1.0.0/team.md', matchPattern),
    ).toEqual(true);

    // Non existing version
    expect(
      isMatch('community_versioned_docs/version-2.0.0/team.md', matchPattern),
    ).toEqual(false);
    expect(
      isMatch(
        'community_versioned_sidebars/version-2.0.0-sidebars.json',
        matchPattern,
      ),
    ).toEqual(false);

    expect(isMatch('community/team.js', matchPattern)).toEqual(false);
    expect(
      isMatch('community_versioned_docs/version-1.0.0/team.js', matchPattern),
    ).toEqual(false);
  });

  test('content', async () => {
    const {siteDir, plugin, pluginContentDir} = await loadSite();
    const content = await plugin.loadContent!();
    expect(content.loadedVersions.length).toEqual(2);
    const [currentVersion, version100] = content.loadedVersions;

    expect(getDocById(currentVersion, 'team')).toEqual({
      ...defaultDocMetadata,
      id: 'team',
      unversionedId: 'team',
      sourceDirName: '.',
      permalink: '/community/next/team',
      slug: '/team',
      source:
        '@site/i18n/en/docusaurus-plugin-content-docs-community/current/team.md',
      title: 'Team title translated',
      description: 'Team current version (translated)',
      version: 'current',
      sidebar: 'community',
      frontMatter: {title: 'Team title translated'},
    });
    expect(getDocById(version100, 'team')).toEqual({
      ...defaultDocMetadata,
      id: 'version-1.0.0/team',
      unversionedId: 'team',
      sourceDirName: '.',
      permalink: '/community/team',
      slug: '/team',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version100.contentPath)),
        'team.md',
      ),
      title: 'team',
      description: 'Team 1.0.0',
      version: '1.0.0',
      sidebar: 'version-1.0.0/community',
      frontMatter: {},
    });

    expect(currentVersion.sidebars).toMatchSnapshot('current version sidebars');
    expect(version100.sidebars).toMatchSnapshot('100 version sidebars');

    const {actions, utils} = createFakeActions(pluginContentDir);
    await plugin.contentLoaded!({
      content,
      actions,
      allContent: {},
    });

    utils.checkVersionMetadataPropCreated(currentVersion);
    utils.checkVersionMetadataPropCreated(version100);

    utils.expectSnapshot();
  });
});

describe('site with doc label', () => {
  async function loadSite() {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-doc-label');
    const context = await loadContext(siteDir);
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        path: 'docs',
        sidebarPath,
      }),
    );

    const content = (await plugin.loadContent?.())!;

    return {content};
  }

  test('label in sidebar.json is used', async () => {
    const {content} = await loadSite();
    const loadedVersion = content.loadedVersions[0];
    const sidebarProps = toSidebarsProp(loadedVersion);

    expect(sidebarProps.docs[0].label).toBe('Hello One');
  });

  test('sidebar_label in doc has higher precedence over label in sidebar.json', async () => {
    const {content} = await loadSite();
    const loadedVersion = content.loadedVersions[0];
    const sidebarProps = toSidebarsProp(loadedVersion);

    expect(sidebarProps.docs[1].label).toBe('Hello 2 From Doc');
  });
});

describe('site with full autogenerated sidebar', () => {
  async function loadSite() {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'site-with-autogenerated-sidebar',
    );
    const context = await loadContext(siteDir);
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        path: 'docs',
      }),
    );

    const content = (await plugin.loadContent?.())!;

    return {content, siteDir};
  }

  test('sidebar is fully autogenerated', async () => {
    const {content} = await loadSite();
    const version = content.loadedVersions[0];

    expect(version.sidebars).toEqual({
      defaultSidebar: [
        {
          type: 'doc',
          id: 'getting-started',
        },
        {
          type: 'doc',
          id: 'installation',
        },
        {
          type: 'category',
          label: 'Guides',
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: 'doc',
              id: 'Guides/guide1',
            },
            {
              type: 'doc',
              id: 'Guides/guide2',
            },
            {
              type: 'doc',
              id: 'Guides/guide2.5',
            },
            {
              type: 'doc',
              id: 'Guides/guide3',
            },
            {
              type: 'doc',
              id: 'Guides/guide4',
            },
            {
              type: 'doc',
              id: 'Guides/guide5',
            },
          ],
        },
        {
          type: 'category',
          label: 'API (label from _category_.json)',
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: 'doc',
              id: 'API/api-overview',
            },
            {
              type: 'category',
              label: 'Core APIs',
              collapsed: true,
              collapsible: true,
              items: [
                {
                  type: 'doc',

                  id: 'API/Core APIs/Client API',
                },
                {
                  type: 'doc',
                  id: 'API/Core APIs/Server API',
                },
              ],
            },
            {
              type: 'category',
              label: 'Extension APIs (label from _category_.yml)',
              collapsed: true,
              collapsible: true,
              items: [
                {
                  type: 'doc',
                  id: 'API/Extension APIs/Plugin API',
                },
                {
                  type: 'doc',
                  id: 'API/Extension APIs/Theme API',
                },
              ],
            },
            {
              type: 'doc',
              id: 'API/api-end',
            },
          ],
        },
      ],
    });
  });

  test('docs in fully generated sidebar have correct metadata', async () => {
    const {content, siteDir} = await loadSite();
    const version = content.loadedVersions[0];

    expect(getDocById(version, 'getting-started')).toEqual({
      ...defaultDocMetadata,
      id: 'getting-started',
      unversionedId: 'getting-started',
      sourceDirName: '.',
      permalink: '/docs/getting-started',
      slug: '/getting-started',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '0-getting-started.md',
      ),
      title: 'Getting Started',
      description: 'Getting started text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 0,
      previous: undefined,
      next: {
        permalink: '/docs/installation',
        title: 'Installation',
      },
    });

    expect(getDocById(version, 'installation')).toEqual({
      ...defaultDocMetadata,
      id: 'installation',
      unversionedId: 'installation',
      sourceDirName: '.',
      permalink: '/docs/installation',
      slug: '/installation',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '1-installation.md',
      ),
      title: 'Installation',
      description: 'Installation text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 1,
      previous: {
        permalink: '/docs/getting-started',
        title: 'Getting Started',
      },
      next: {
        permalink: '/docs/Guides/guide1',
        title: 'Guide 1',
      },
    });

    expect(getDocById(version, 'Guides/guide1')).toEqual({
      ...defaultDocMetadata,
      id: 'Guides/guide1',
      unversionedId: 'Guides/guide1',
      sourceDirName: 'Guides',
      permalink: '/docs/Guides/guide1',
      slug: '/Guides/guide1',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        'Guides',
        'z-guide1.md',
      ),
      title: 'Guide 1',
      description: 'Guide 1 text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {
        id: 'guide1',
        sidebar_position: 1,
      },
      sidebarPosition: 1,
      previous: {
        permalink: '/docs/installation',
        title: 'Installation',
      },
      next: {
        permalink: '/docs/Guides/guide2',
        title: 'Guide 2',
      },
    });

    expect(getDocById(version, 'Guides/guide2')).toEqual({
      ...defaultDocMetadata,
      id: 'Guides/guide2',
      unversionedId: 'Guides/guide2',
      sourceDirName: 'Guides',
      permalink: '/docs/Guides/guide2',
      slug: '/Guides/guide2',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        'Guides',
        '02-guide2.md',
      ),
      title: 'Guide 2',
      description: 'Guide 2 text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {
        id: 'guide2',
      },
      sidebarPosition: 2,
      previous: {
        permalink: '/docs/Guides/guide1',
        title: 'Guide 1',
      },
      next: {
        permalink: '/docs/Guides/guide2.5',
        title: 'Guide 2.5',
      },
    });

    expect(getDocById(version, 'Guides/guide2.5')).toEqual({
      ...defaultDocMetadata,
      id: 'Guides/guide2.5',
      unversionedId: 'Guides/guide2.5',
      sourceDirName: 'Guides',
      permalink: '/docs/Guides/guide2.5',
      slug: '/Guides/guide2.5',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        'Guides',
        '0-guide2.5.md',
      ),
      title: 'Guide 2.5',
      description: 'Guide 2.5 text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {
        id: 'guide2.5',
        sidebar_position: 2.5,
      },
      sidebarPosition: 2.5,
      previous: {
        permalink: '/docs/Guides/guide2',
        title: 'Guide 2',
      },
      next: {
        permalink: '/docs/Guides/guide3',
        title: 'Guide 3',
      },
    });

    expect(getDocById(version, 'Guides/guide3')).toEqual({
      ...defaultDocMetadata,
      id: 'Guides/guide3',
      unversionedId: 'Guides/guide3',
      sourceDirName: 'Guides',
      permalink: '/docs/Guides/guide3',
      slug: '/Guides/guide3',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        'Guides',
        'guide3.md',
      ),
      title: 'Guide 3',
      description: 'Guide 3 text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {
        id: 'guide3',
        sidebar_position: 3,
      },
      sidebarPosition: 3,
      previous: {
        permalink: '/docs/Guides/guide2.5',
        title: 'Guide 2.5',
      },
      next: {
        permalink: '/docs/Guides/guide4',
        title: 'Guide 4',
      },
    });

    expect(getDocById(version, 'Guides/guide4')).toEqual({
      ...defaultDocMetadata,
      id: 'Guides/guide4',
      unversionedId: 'Guides/guide4',
      sourceDirName: 'Guides',
      permalink: '/docs/Guides/guide4',
      slug: '/Guides/guide4',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        'Guides',
        'a-guide4.md',
      ),
      title: 'Guide 4',
      description: 'Guide 4 text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {
        id: 'guide4',
      },
      sidebarPosition: undefined,
      previous: {
        permalink: '/docs/Guides/guide3',
        title: 'Guide 3',
      },
      next: {
        permalink: '/docs/Guides/guide5',
        title: 'Guide 5',
      },
    });

    expect(getDocById(version, 'Guides/guide5')).toEqual({
      ...defaultDocMetadata,
      id: 'Guides/guide5',
      unversionedId: 'Guides/guide5',
      sourceDirName: 'Guides',
      permalink: '/docs/Guides/guide5',
      slug: '/Guides/guide5',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        'Guides',
        'b-guide5.md',
      ),
      title: 'Guide 5',
      description: 'Guide 5 text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {
        id: 'guide5',
      },
      sidebarPosition: undefined,
      previous: {
        permalink: '/docs/Guides/guide4',
        title: 'Guide 4',
      },
      next: {
        permalink: '/docs/API/api-overview',
        title: 'API Overview',
      },
    });

    expect(getDocById(version, 'API/api-overview')).toEqual({
      ...defaultDocMetadata,
      id: 'API/api-overview',
      unversionedId: 'API/api-overview',
      sourceDirName: '3-API',
      permalink: '/docs/API/api-overview',
      slug: '/API/api-overview',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '00_api-overview.md',
      ),
      title: 'API Overview',
      description: 'API Overview text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 0,
      previous: {
        permalink: '/docs/Guides/guide5',
        title: 'Guide 5',
      },
      next: {
        permalink: '/docs/API/Core APIs/Client API',
        title: 'Client API',
      },
    });

    expect(getDocById(version, 'API/Core APIs/Client API')).toEqual({
      ...defaultDocMetadata,
      id: 'API/Core APIs/Client API',
      unversionedId: 'API/Core APIs/Client API',
      sourceDirName: '3-API/01_Core APIs',
      permalink: '/docs/API/Core APIs/Client API',
      slug: '/API/Core APIs/Client API',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '01_Core APIs',
        '0 --- Client API.md',
      ),
      title: 'Client API',
      description: 'Client API text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 0,
      previous: {
        permalink: '/docs/API/api-overview',
        title: 'API Overview',
      },
      next: {
        permalink: '/docs/API/Core APIs/Server API',
        title: 'Server API',
      },
    });

    expect(getDocById(version, 'API/Core APIs/Server API')).toEqual({
      ...defaultDocMetadata,
      id: 'API/Core APIs/Server API',
      unversionedId: 'API/Core APIs/Server API',
      sourceDirName: '3-API/01_Core APIs',
      permalink: '/docs/API/Core APIs/Server API',
      slug: '/API/Core APIs/Server API',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '01_Core APIs',
        '1 --- Server API.md',
      ),
      title: 'Server API',
      description: 'Server API text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 1,
      previous: {
        permalink: '/docs/API/Core APIs/Client API',
        title: 'Client API',
      },
      next: {
        permalink: '/docs/API/Extension APIs/Plugin API',
        title: 'Plugin API',
      },
    });

    expect(getDocById(version, 'API/Extension APIs/Plugin API')).toEqual({
      ...defaultDocMetadata,
      id: 'API/Extension APIs/Plugin API',
      unversionedId: 'API/Extension APIs/Plugin API',
      sourceDirName: '3-API/02_Extension APIs',
      permalink: '/docs/API/Extension APIs/Plugin API',
      slug: '/API/Extension APIs/Plugin API',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '02_Extension APIs',
        '0. Plugin API.md',
      ),
      title: 'Plugin API',
      description: 'Plugin API text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 0,
      previous: {
        permalink: '/docs/API/Core APIs/Server API',
        title: 'Server API',
      },
      next: {
        permalink: '/docs/API/Extension APIs/Theme API',
        title: 'Theme API',
      },
    });

    expect(getDocById(version, 'API/Extension APIs/Theme API')).toEqual({
      ...defaultDocMetadata,
      id: 'API/Extension APIs/Theme API',
      unversionedId: 'API/Extension APIs/Theme API',
      sourceDirName: '3-API/02_Extension APIs',
      permalink: '/docs/API/Extension APIs/Theme API',
      slug: '/API/Extension APIs/Theme API',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '02_Extension APIs',
        '1. Theme API.md',
      ),
      title: 'Theme API',
      description: 'Theme API text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 1,
      previous: {
        permalink: '/docs/API/Extension APIs/Plugin API',
        title: 'Plugin API',
      },
      next: {
        permalink: '/docs/API/api-end',
        title: 'API End',
      },
    });

    expect(getDocById(version, 'API/api-end')).toEqual({
      ...defaultDocMetadata,
      id: 'API/api-end',
      unversionedId: 'API/api-end',
      sourceDirName: '3-API',
      permalink: '/docs/API/api-end',
      slug: '/API/api-end',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '03_api-end.md',
      ),
      title: 'API End',
      description: 'API End text',
      version: 'current',
      sidebar: 'defaultSidebar',
      frontMatter: {},
      sidebarPosition: 3,
      previous: {
        permalink: '/docs/API/Extension APIs/Theme API',
        title: 'Theme API',
      },
      next: undefined,
    });
  });
});

describe('site with partial autogenerated sidebars', () => {
  async function loadSite() {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'site-with-autogenerated-sidebar',
    );
    const context = await loadContext(siteDir, {});
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        path: 'docs',
        sidebarPath: path.join(
          __dirname,
          '__fixtures__',
          'site-with-autogenerated-sidebar',
          'partialAutogeneratedSidebars.js',
        ),
      }),
    );

    const content = (await plugin.loadContent?.())!;

    return {content, siteDir};
  }

  test('sidebar is partially autogenerated', async () => {
    const {content} = await loadSite();
    const version = content.loadedVersions[0];

    expect(version.sidebars).toEqual({
      someSidebar: [
        {
          type: 'doc',
          id: 'API/api-end',
        },
        {
          type: 'category',
          label: 'Some category',
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: 'doc',
              id: 'API/api-overview',
            },
            {
              type: 'doc',
              id: 'API/Extension APIs/Plugin API',
            },
            {
              type: 'doc',
              id: 'API/Extension APIs/Theme API',
            },
          ],
        },
      ],
    });
  });

  test('docs in partially generated sidebar have correct metadata', async () => {
    const {content, siteDir} = await loadSite();
    const version = content.loadedVersions[0];

    // Only looking at the docs of the autogen sidebar, others metadata should not be affected

    expect(getDocById(version, 'API/api-end')).toEqual({
      ...defaultDocMetadata,
      id: 'API/api-end',
      unversionedId: 'API/api-end',
      sourceDirName: '3-API',
      permalink: '/docs/API/api-end',
      slug: '/API/api-end',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '03_api-end.md',
      ),
      title: 'API End',
      description: 'API End text',
      version: 'current',
      sidebar: 'someSidebar',
      frontMatter: {},
      sidebarPosition: 3, // ignored (not part of the autogenerated sidebar slice)
      previous: undefined,
      next: {
        permalink: '/docs/API/api-overview',
        title: 'API Overview',
      },
    });

    expect(getDocById(version, 'API/api-overview')).toEqual({
      ...defaultDocMetadata,
      id: 'API/api-overview',
      unversionedId: 'API/api-overview',
      sourceDirName: '3-API',
      permalink: '/docs/API/api-overview',
      slug: '/API/api-overview',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '00_api-overview.md',
      ),
      title: 'API Overview',
      description: 'API Overview text',
      version: 'current',
      sidebar: 'someSidebar',
      frontMatter: {},
      sidebarPosition: 0, // ignored (not part of the autogenerated sidebar slice)
      previous: {
        permalink: '/docs/API/api-end',
        title: 'API End',
      },
      next: {
        permalink: '/docs/API/Extension APIs/Plugin API',
        title: 'Plugin API',
      },
    });

    expect(getDocById(version, 'API/Extension APIs/Plugin API')).toEqual({
      ...defaultDocMetadata,
      id: 'API/Extension APIs/Plugin API',
      unversionedId: 'API/Extension APIs/Plugin API',
      sourceDirName: '3-API/02_Extension APIs',
      permalink: '/docs/API/Extension APIs/Plugin API',
      slug: '/API/Extension APIs/Plugin API',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '02_Extension APIs',
        '0. Plugin API.md',
      ),
      title: 'Plugin API',
      description: 'Plugin API text',
      version: 'current',
      sidebar: 'someSidebar',
      frontMatter: {},
      sidebarPosition: 0,
      previous: {
        permalink: '/docs/API/api-overview',
        title: 'API Overview',
      },
      next: {
        permalink: '/docs/API/Extension APIs/Theme API',
        title: 'Theme API',
      },
    });

    expect(getDocById(version, 'API/Extension APIs/Theme API')).toEqual({
      ...defaultDocMetadata,
      id: 'API/Extension APIs/Theme API',
      unversionedId: 'API/Extension APIs/Theme API',
      sourceDirName: '3-API/02_Extension APIs',
      permalink: '/docs/API/Extension APIs/Theme API',
      slug: '/API/Extension APIs/Theme API',
      source: path.posix.join(
        '@site',
        posixPath(path.relative(siteDir, version.contentPath)),
        '3-API',
        '02_Extension APIs',
        '1. Theme API.md',
      ),
      title: 'Theme API',
      description: 'Theme API text',
      version: 'current',
      sidebar: 'someSidebar',
      frontMatter: {},
      sidebarPosition: 1,
      previous: {
        permalink: '/docs/API/Extension APIs/Plugin API',
        title: 'Plugin API',
      },
      next: undefined,
    });
  });
});

describe('site with partial autogenerated sidebars 2 (fix #4638)', () => {
  // Test added for edge case https://github.com/facebook/docusaurus/issues/4638

  async function loadSite() {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'site-with-autogenerated-sidebar',
    );
    const context = await loadContext(siteDir, {});
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        path: 'docs',
        sidebarPath: path.join(
          __dirname,
          '__fixtures__',
          'site-with-autogenerated-sidebar',
          'partialAutogeneratedSidebars2.js',
        ),
      }),
    );

    const content = (await plugin.loadContent?.())!;

    return {content, siteDir};
  }

  test('sidebar is partially autogenerated', async () => {
    const {content} = await loadSite();
    const version = content.loadedVersions[0];

    expect(version.sidebars).toEqual({
      someSidebar: [
        {
          type: 'doc',
          id: 'API/api-end',
        },
        {
          type: 'doc',
          id: 'API/api-overview',
        },
        {
          type: 'category',
          label: 'Core APIs',
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: 'doc',

              id: 'API/Core APIs/Client API',
            },
            {
              type: 'doc',
              id: 'API/Core APIs/Server API',
            },
          ],
        },
        {
          type: 'category',
          label: 'Extension APIs (label from _category_.yml)', // Fix #4638
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: 'doc',
              id: 'API/Extension APIs/Plugin API',
            },
            {
              type: 'doc',
              id: 'API/Extension APIs/Theme API',
            },
          ],
        },
        {
          type: 'doc',
          id: 'API/api-end',
        },
      ],
    });
  });
});

describe('site with custom sidebar items generator', () => {
  async function loadSite(sidebarItemsGenerator: SidebarItemsGeneratorOption) {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'site-with-autogenerated-sidebar',
    );
    const context = await loadContext(siteDir);
    const plugin = pluginContentDocs(
      context,
      normalizePluginOptions(OptionsSchema, {
        path: 'docs',
        sidebarItemsGenerator,
      }),
    );
    const content = (await plugin.loadContent?.())!;
    return {content, siteDir};
  }

  test('sidebarItemsGenerator is called with appropriate data', async () => {
    const customSidebarItemsGeneratorMock = jest.fn(
      async (_arg: SidebarItemsGeneratorOptionArgs) => [],
    );
    const {siteDir} = await loadSite(customSidebarItemsGeneratorMock);

    const generatorArg: SidebarItemsGeneratorOptionArgs =
      customSidebarItemsGeneratorMock.mock.calls[0][0];

    // Make test pass even if docs are in different order and paths are absolutes
    function makeDeterministic(
      arg: SidebarItemsGeneratorOptionArgs,
    ): SidebarItemsGeneratorOptionArgs {
      return {
        ...arg,
        docs: orderBy(arg.docs, 'id'),
        version: {
          ...arg.version,
          contentPath: path.relative(siteDir, arg.version.contentPath),
        },
      };
    }

    expect(makeDeterministic(generatorArg)).toMatchSnapshot();
    expect(generatorArg.defaultSidebarItemsGenerator).toEqual(
      DefaultSidebarItemsGenerator,
    );
  });

  test('sidebar is autogenerated according to a custom sidebarItemsGenerator', async () => {
    const customSidebarItemsGenerator: SidebarItemsGeneratorOption =
      async () => [
        {type: 'doc', id: 'API/api-overview'},
        {type: 'doc', id: 'API/api-end'},
      ];

    const {content} = await loadSite(customSidebarItemsGenerator);
    const version = content.loadedVersions[0];

    expect(version.sidebars).toEqual({
      defaultSidebar: [
        {type: 'doc', id: 'API/api-overview'},
        {type: 'doc', id: 'API/api-end'},
      ],
    });
  });

  test('sidebarItemsGenerator can wrap/enhance/sort/reverse the default sidebar generator', async () => {
    function reverseSidebarItems(items: SidebarItem[]): SidebarItem[] {
      const result: SidebarItem[] = items.map((item) => {
        if (item.type === 'category') {
          return {...item, items: reverseSidebarItems(item.items)};
        }
        return item;
      });
      result.reverse();
      return result;
    }

    const reversedSidebarItemsGenerator: SidebarItemsGeneratorOption = async ({
      defaultSidebarItemsGenerator,
      ...args
    }) => {
      const sidebarItems = await defaultSidebarItemsGenerator(args);
      return reverseSidebarItems(sidebarItems);
    };

    const {content} = await loadSite(reversedSidebarItemsGenerator);
    const version = content.loadedVersions[0];

    expect(version.sidebars).toEqual({
      defaultSidebar: [
        {
          type: 'category',
          label: 'API (label from _category_.json)',
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: 'doc',
              id: 'API/api-end',
            },
            {
              type: 'category',
              label: 'Extension APIs (label from _category_.yml)',
              collapsed: true,
              collapsible: true,
              items: [
                {
                  type: 'doc',
                  id: 'API/Extension APIs/Theme API',
                },
                {
                  type: 'doc',
                  id: 'API/Extension APIs/Plugin API',
                },
              ],
            },
            {
              type: 'category',
              label: 'Core APIs',
              collapsed: true,
              collapsible: true,
              items: [
                {
                  type: 'doc',
                  id: 'API/Core APIs/Server API',
                },
                {
                  type: 'doc',
                  id: 'API/Core APIs/Client API',
                },
              ],
            },
            {
              type: 'doc',
              id: 'API/api-overview',
            },
          ],
        },
        {
          type: 'category',
          label: 'Guides',
          collapsed: true,
          collapsible: true,
          items: [
            {
              type: 'doc',
              id: 'Guides/guide5',
            },
            {
              type: 'doc',
              id: 'Guides/guide4',
            },
            {
              type: 'doc',
              id: 'Guides/guide3',
            },
            {
              type: 'doc',
              id: 'Guides/guide2.5',
            },
            {
              type: 'doc',
              id: 'Guides/guide2',
            },
            {
              type: 'doc',
              id: 'Guides/guide1',
            },
          ],
        },
        {
          type: 'doc',
          id: 'installation',
        },
        {
          type: 'doc',
          id: 'getting-started',
        },
      ],
    });
  });
});
