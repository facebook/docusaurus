/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {validate} from 'webpack';
import {isMatch} from 'picomatch';
import commander from 'commander';
import fs from 'fs-extra';
import pluginContentDocs from '../index';
import loadEnv from '../env';
import {loadContext} from '@docusaurus/core/src/server/index';
import {applyConfigureWebpack} from '@docusaurus/core/src/webpack/utils';
import {RouteConfig} from '@docusaurus/types';
import {posixPath} from '@docusaurus/utils';
import {sortConfig} from '@docusaurus/core/src/server/plugins';

import * as version from '../version';

const createFakeActions = (
  routeConfigs: RouteConfig[],
  contentDir,
  dataContainer?,
) => {
  return {
    addRoute: (config: RouteConfig) => {
      routeConfigs.push(config);
    },
    createData: async (name, content) => {
      if (dataContainer) {
        dataContainer[name] = content;
      }
      return path.join(contentDir, name);
    },
  };
};

test('site with wrong sidebar file', async () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
  const context = loadContext(siteDir);
  const sidebarPath = path.join(siteDir, 'wrong-sidebars.json');
  const plugin = pluginContentDocs(context, {
    sidebarPath,
  });
  await expect(plugin.loadContent()).rejects.toThrowErrorMatchingSnapshot();
});

describe('empty/no docs website', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'empty-site');
  const context = loadContext(siteDir);

  test('no files in docs folder', async () => {
    await fs.ensureDir(path.join(siteDir, 'docs'));
    const plugin = pluginContentDocs(context, {});
    const content = await plugin.loadContent();
    const {docsMetadata, docsSidebars} = content;
    expect(docsMetadata).toMatchInlineSnapshot(`Object {}`);
    expect(docsSidebars).toMatchInlineSnapshot(`Object {}`);

    const routeConfigs = [];
    const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);
    const actions = createFakeActions(routeConfigs, pluginContentDir);

    await plugin.contentLoaded({
      content,
      actions,
    });

    expect(routeConfigs).toEqual([]);
  });

  test('docs folder does not exist', async () => {
    const plugin = pluginContentDocs(context, {path: '/path/does/not/exist/'});
    const content = await plugin.loadContent();
    expect(content).toBeNull();
  });
});

describe('simple website', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'simple-site');
  const context = loadContext(siteDir);
  const sidebarPath = path.join(siteDir, 'sidebars.json');
  const pluginPath = 'docs';
  const plugin = pluginContentDocs(context, {
    path: pluginPath,
    sidebarPath,
    homePageId: 'hello',
  });
  const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);

  test('extendCli - docsVersion', () => {
    const mock = jest.spyOn(version, 'docsVersion').mockImplementation();
    const cli = new commander.Command();
    plugin.extendCli(cli);
    cli.parse(['node', 'test', 'docs:version', '1.0.0']);
    expect(mock).toHaveBeenCalledWith('1.0.0', siteDir, {
      path: pluginPath,
      sidebarPath,
    });
    mock.mockRestore();
  });

  test('getPathToWatch', () => {
    const pathToWatch = plugin.getPathsToWatch();
    const matchPattern = pathToWatch.map((filepath) =>
      posixPath(path.relative(siteDir, filepath)),
    );
    expect(matchPattern).not.toEqual([]);
    expect(matchPattern).toMatchInlineSnapshot(`
      Array [
        "docs/**/*.{md,mdx}",
        "sidebars.json",
      ]
    `);
    expect(isMatch('docs/hello.md', matchPattern)).toEqual(true);
    expect(isMatch('docs/hello.mdx', matchPattern)).toEqual(true);
    expect(isMatch('docs/foo/bar.md', matchPattern)).toEqual(true);
    expect(isMatch('docs/hello.js', matchPattern)).toEqual(false);
    expect(isMatch('docs/super.mdl', matchPattern)).toEqual(false);
    expect(isMatch('docs/mdx', matchPattern)).toEqual(false);
    expect(isMatch('sidebars.json', matchPattern)).toEqual(true);
    expect(isMatch('versioned_docs/hello.md', matchPattern)).toEqual(false);
    expect(isMatch('hello.md', matchPattern)).toEqual(false);
    expect(isMatch('super/docs/hello.md', matchPattern)).toEqual(false);
  });

  test('configureWebpack', async () => {
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
    );
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('content', async () => {
    const content = await plugin.loadContent();
    const {
      docsMetadata,
      docsSidebars,
      versionToSidebars,
      permalinkToSidebar,
    } = content;
    expect(versionToSidebars).toEqual({});
    expect(docsMetadata.hello).toEqual({
      id: 'hello',
      permalink: '/docs/hello',
      previous: {
        title: 'baz',
        permalink: '/docs/foo/bazSlug.html',
      },
      sidebar: 'docs',
      source: path.join('@site', pluginPath, 'hello.md'),
      title: 'Hello, World !',
      description: 'Hi, Endilie here :)',
      latestPermaLink: undefined,
    });

    expect(docsMetadata['foo/bar']).toEqual({
      id: 'foo/bar',
      next: {
        title: 'baz',
        permalink: '/docs/foo/bazSlug.html',
      },
      permalink: '/docs/foo/bar',
      sidebar: 'docs',
      source: path.join('@site', pluginPath, 'foo', 'bar.md'),
      title: 'Bar',
      description: 'This is custom description',
      latestPermaLink: undefined,
    });

    expect(docsSidebars).toMatchSnapshot();

    const routeConfigs = [];
    const dataContainer = {};
    const actions = createFakeActions(
      routeConfigs,
      pluginContentDir,
      dataContainer,
    );

    await plugin.contentLoaded({
      content,
      actions,
    });

    // There is only one nested docs route for simple site
    const baseMetadata = JSON.parse(dataContainer['docs-route-ff2.json']);
    expect(baseMetadata.docsSidebars).toEqual(docsSidebars);
    expect(baseMetadata.permalinkToSidebar).toEqual(permalinkToSidebar);

    // Sort the route config like in src/server/plugins/index.ts for consistent snapshot ordering
    sortConfig(routeConfigs);

    expect(routeConfigs).not.toEqual([]);
    expect(routeConfigs).toMatchSnapshot();
  });
});

describe('versioned website', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'versioned-site');
  const context = loadContext(siteDir);
  const sidebarPath = path.join(siteDir, 'sidebars.json');
  const routeBasePath = 'docs';
  const plugin = pluginContentDocs(context, {
    routeBasePath,
    sidebarPath,
    homePageId: 'hello',
  });
  const env = loadEnv(siteDir);
  const {docsDir: versionedDir} = env.versioning;
  const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);

  test('extendCli - docsVersion', () => {
    const mock = jest.spyOn(version, 'docsVersion').mockImplementation();
    const cli = new commander.Command();
    plugin.extendCli(cli);
    cli.parse(['node', 'test', 'docs:version', '2.0.0']);
    expect(mock).toHaveBeenCalledWith('2.0.0', siteDir, {
      path: routeBasePath,
      sidebarPath,
    });
    mock.mockRestore();
  });

  test('getPathToWatch', () => {
    const pathToWatch = plugin.getPathsToWatch();
    const matchPattern = pathToWatch.map((filepath) =>
      posixPath(path.relative(siteDir, filepath)),
    );
    expect(matchPattern).not.toEqual([]);
    expect(matchPattern).toMatchInlineSnapshot(`
      Array [
        "docs/**/*.{md,mdx}",
        "versioned_sidebars/version-1.0.1-sidebars.json",
        "versioned_sidebars/version-1.0.0-sidebars.json",
        "versioned_docs/version-1.0.1/**/*.{md,mdx}",
        "versioned_docs/version-1.0.0/**/*.{md,mdx}",
        "sidebars.json",
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
    const content = await plugin.loadContent();
    const {
      docsMetadata,
      docsSidebars,
      versionToSidebars,
      permalinkToSidebar,
    } = content;

    // foo/baz.md only exists in version -1.0.0
    expect(docsMetadata['foo/baz']).toBeUndefined();
    expect(docsMetadata['version-1.0.1/foo/baz']).toBeUndefined();
    expect(docsMetadata['foo/bar']).toEqual({
      id: 'foo/bar',
      permalink: '/docs/next/foo/barSlug',
      source: path.join('@site', routeBasePath, 'foo', 'bar.md'),
      title: 'bar',
      description: 'This is next version of bar.',
      version: 'next',
      sidebar: 'docs',
      next: {
        title: 'hello',
        permalink: '/docs/next/hello',
      },
      latestPermaLink: undefined,
    });
    expect(docsMetadata['hello']).toEqual({
      id: 'hello',
      permalink: '/docs/next/hello',
      source: path.join('@site', routeBasePath, 'hello.md'),
      title: 'hello',
      description: 'Hello next !',
      version: 'next',
      sidebar: 'docs',
      previous: {
        title: 'bar',
        permalink: '/docs/next/foo/barSlug',
      },
      latestPermaLink: undefined,
    });
    expect(docsMetadata['version-1.0.1/hello']).toEqual({
      id: 'version-1.0.1/hello',
      permalink: '/docs/hello',
      source: path.join(
        '@site',
        path.relative(siteDir, versionedDir),
        'version-1.0.1',
        'hello.md',
      ),
      title: 'hello',
      description: 'Hello 1.0.1 !',
      version: '1.0.1',
      sidebar: 'version-1.0.1/docs',
      previous: {
        title: 'bar',
        permalink: '/docs/foo/bar',
      },
      latestPermaLink: undefined,
    });
    expect(docsMetadata['version-1.0.0/foo/baz']).toEqual({
      id: 'version-1.0.0/foo/baz',
      permalink: '/docs/1.0.0/foo/baz',
      source: path.join(
        '@site',
        path.relative(siteDir, versionedDir),
        'version-1.0.0',
        'foo',
        'baz.md',
      ),
      title: 'baz',
      description:
        'Baz 1.0.0 ! This will be deleted in next subsequent versions.',
      version: '1.0.0',
      sidebar: 'version-1.0.0/docs',
      next: {
        title: 'hello',
        permalink: '/docs/1.0.0/hello',
      },
      previous: {
        title: 'bar',
        permalink: '/docs/1.0.0/foo/barSlug',
      },
      latestPermaLink: '@site/docs',
    });

    expect(docsSidebars).toMatchSnapshot('all sidebars');
    expect(versionToSidebars).toMatchSnapshot(
      'sidebars needed for each version',
    );
    const routeConfigs = [];
    const dataContainer = {};
    const actions = createFakeActions(
      routeConfigs,
      pluginContentDir,
      dataContainer,
    );
    await plugin.contentLoaded({
      content,
      actions,
    });

    // The created base metadata for each nested docs route is smartly chunked/ splitted across version
    const latestVersionBaseMetadata = JSON.parse(
      dataContainer['docs-route-ff2.json'],
    );
    expect(latestVersionBaseMetadata).toMatchSnapshot(
      'base metadata for latest version',
    );
    expect(latestVersionBaseMetadata.docsSidebars).not.toEqual(docsSidebars);
    expect(latestVersionBaseMetadata.permalinkToSidebar).not.toEqual(
      permalinkToSidebar,
    );
    const nextVersionBaseMetadata = JSON.parse(
      dataContainer['docs-next-route-1c8.json'],
    );
    expect(nextVersionBaseMetadata).toMatchSnapshot(
      'base metadata for next version',
    );
    expect(nextVersionBaseMetadata.docsSidebars).not.toEqual(docsSidebars);
    expect(nextVersionBaseMetadata.permalinkToSidebar).not.toEqual(
      permalinkToSidebar,
    );
    const firstVersionBaseMetadata = JSON.parse(
      dataContainer['docs-1-0-0-route-660.json'],
    );
    expect(firstVersionBaseMetadata).toMatchSnapshot(
      'base metadata for first version',
    );
    expect(nextVersionBaseMetadata.docsSidebars).not.toEqual(docsSidebars);
    expect(nextVersionBaseMetadata.permalinkToSidebar).not.toEqual(
      permalinkToSidebar,
    );

    // Sort the route config like in src/server/plugins/index.ts for consistent snapshot ordering
    sortConfig(routeConfigs);

    expect(routeConfigs).not.toEqual([]);
    expect(routeConfigs).toMatchSnapshot();
  });
});
