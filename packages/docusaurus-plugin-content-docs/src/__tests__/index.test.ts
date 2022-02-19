/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {isMatch} from 'picomatch';
import commander from 'commander';
import _ from 'lodash';

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
import type {LoadedVersion} from '../types';
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
        `version-${_.kebabCase(version.versionName)}-metadata-prop`,
      );
      expect(versionMetadataProp.docsSidebars).toEqual(toSidebarsProp(version));
    },

    expectSnapshot: () => {
      // Sort the route config like in src/server/plugins/index.ts for
      // consistent snapshot ordering
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
    const plugin = await pluginContentDocs(
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
      const plugin = await pluginContentDocs(
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
            - undefined: for Docusaurus to generate it automatically"
          `);
  });

  test('site with undefined sidebar', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'site-with-doc-label');
    const context = await loadContext(siteDir);
    const plugin = await pluginContentDocs(
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
    const plugin = await pluginContentDocs(
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
    const plugin = await pluginContentDocs(
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
    await expect(
      pluginContentDocs(
        context,
        normalizePluginOptions(OptionsSchema, {
          path: `path/doesnt/exist`,
        }),
      ),
    ).rejects.toThrowError(
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
    const plugin = await pluginContentDocs(
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
    // @ts-expect-error: in actual usage, we pass the static commander instead
    // of the new command
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
    const {plugin, pluginContentDir} = await loadSite();
    const content = await plugin.loadContent!();
    expect(content.loadedVersions.length).toEqual(1);
    const [currentVersion] = content.loadedVersions;

    expect(findDocById(currentVersion, 'foo/baz')).toMatchSnapshot();

    expect(findDocById(currentVersion, 'hello')).toMatchSnapshot();

    expect(getDocById(currentVersion, 'foo/bar')).toMatchSnapshot();

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
    const plugin = await pluginContentDocs(
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
    // @ts-expect-error: in actual usage, we pass the static commander instead
    // of the new command
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
    const {plugin, pluginContentDir} = await loadSite();
    const content = await plugin.loadContent!();
    expect(content.loadedVersions.length).toEqual(4);
    const [currentVersion, version101, version100, versionWithSlugs] =
      content.loadedVersions;

    // foo/baz.md only exists in version -1.0.0
    expect(findDocById(currentVersion, 'foo/baz')).toBeUndefined();
    expect(findDocById(version101, 'foo/baz')).toBeUndefined();
    expect(findDocById(versionWithSlugs, 'foo/baz')).toBeUndefined();

    expect(getDocById(currentVersion, 'foo/bar')).toMatchSnapshot();
    expect(getDocById(version101, 'foo/bar')).toMatchSnapshot();

    expect(getDocById(currentVersion, 'hello')).toMatchSnapshot();
    expect(getDocById(version101, 'hello')).toMatchSnapshot();
    expect(getDocById(version100, 'foo/baz')).toMatchSnapshot();

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
    const plugin = await pluginContentDocs(
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
    // @ts-expect-error: in actual usage, we pass the static commander instead
    // of the new command
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
    const {plugin, pluginContentDir} = await loadSite();
    const content = await plugin.loadContent!();
    expect(content.loadedVersions.length).toEqual(2);
    const [currentVersion, version100] = content.loadedVersions;

    expect(getDocById(currentVersion, 'team')).toMatchSnapshot();
    expect(getDocById(version100, 'team')).toMatchSnapshot();

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
    const plugin = await pluginContentDocs(
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
    const plugin = await pluginContentDocs(
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

    expect(version.sidebars).toMatchSnapshot();
  });

  test('docs in fully generated sidebar have correct metadata', async () => {
    const {content} = await loadSite();
    const version = content.loadedVersions[0];

    expect(getDocById(version, 'getting-started')).toMatchSnapshot();
    expect(getDocById(version, 'installation')).toMatchSnapshot();
    expect(getDocById(version, 'Guides/guide1')).toMatchSnapshot();
    expect(getDocById(version, 'Guides/guide2')).toMatchSnapshot();
    expect(getDocById(version, 'Guides/guide2.5')).toMatchSnapshot();
    expect(getDocById(version, 'Guides/guide3')).toMatchSnapshot();
    expect(getDocById(version, 'Guides/guide4')).toMatchSnapshot();
    expect(getDocById(version, 'Guides/guide5')).toMatchSnapshot();
    expect(getDocById(version, 'API/api-overview')).toMatchSnapshot();
    expect(getDocById(version, 'API/Core APIs/Client API')).toMatchSnapshot();
    expect(getDocById(version, 'API/Core APIs/Server API')).toMatchSnapshot();
    expect(
      getDocById(version, 'API/Extension APIs/Plugin API'),
    ).toMatchSnapshot();
    expect(
      getDocById(version, 'API/Extension APIs/Theme API'),
    ).toMatchSnapshot();
    expect(getDocById(version, 'API/api-end')).toMatchSnapshot();
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
    const plugin = await pluginContentDocs(
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

    expect(version.sidebars).toMatchSnapshot();
  });

  test('docs in partially generated sidebar have correct metadata', async () => {
    const {content} = await loadSite();
    const version = content.loadedVersions[0];

    // Only looking at the docs of the autogen sidebar, others metadata should
    // not be affected

    expect(getDocById(version, 'API/api-end')).toMatchSnapshot();
    expect(getDocById(version, 'API/api-overview')).toMatchSnapshot();
    expect(
      getDocById(version, 'API/Extension APIs/Plugin API'),
    ).toMatchSnapshot();
    expect(
      getDocById(version, 'API/Extension APIs/Theme API'),
    ).toMatchSnapshot();
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
    const plugin = await pluginContentDocs(
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

    expect(version.sidebars).toMatchSnapshot();
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
    const plugin = await pluginContentDocs(
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

    // Make test pass even if docs are in different order and paths are
    // absolutes
    function makeDeterministic(
      arg: SidebarItemsGeneratorOptionArgs,
    ): SidebarItemsGeneratorOptionArgs {
      return {
        ...arg,
        docs: _.orderBy(arg.docs, 'id'),
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

    expect(version.sidebars).toMatchSnapshot();
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

    expect(version.sidebars).toMatchSnapshot();
  });
});
