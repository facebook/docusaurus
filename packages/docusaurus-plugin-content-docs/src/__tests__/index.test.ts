/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {validate} from 'webpack';
import fs from 'fs-extra';
import pluginContentDocs from '../index';
import {loadContext} from '@docusaurus/core/src/server/index';
import {applyConfigureWebpack} from '@docusaurus/core/src/webpack/utils';
import {RouteConfig} from '@docusaurus/types';

const createFakeActions = (routeConfigs: RouteConfig[], contentDir) => {
  return {
    addRoute: (config: RouteConfig) => {
      config.routes.sort((a, b) =>
        a.path > b.path ? 1 : b.path > a.path ? -1 : 0,
      );
      routeConfigs.push(config);
    },
    createData: async (name, _content) => {
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
  return plugin
    .loadContent()
    .catch(e =>
      expect(e).toMatchInlineSnapshot(
        `[Error: Improper sidebars file, document with id 'goku' not found.]`,
      ),
    );
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
  });
  const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);

  test('getPathToWatch', () => {
    const pathToWatch = plugin.getPathsToWatch();
    expect(pathToWatch).not.toEqual([]);
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
    const {docsMetadata, docsSidebars} = content;
    expect(docsMetadata.hello).toEqual({
      id: 'hello',
      permalink: '/docs/hello',
      previous: {
        title: 'baz',
        permalink: '/docs/foo/baz',
      },
      sidebar: 'docs',
      source: path.join('@site', pluginPath, 'hello.md'),
      title: 'Hello, World !',
      description: 'Hi, Endilie here :)',
    });

    expect(docsMetadata['foo/bar']).toEqual({
      id: 'foo/bar',
      next: {
        title: 'baz',
        permalink: '/docs/foo/baz',
      },
      permalink: '/docs/foo/bar',
      sidebar: 'docs',
      source: path.join('@site', pluginPath, 'foo', 'bar.md'),
      title: 'Bar',
      description: 'This is custom description',
    });

    expect(docsSidebars).toMatchSnapshot();

    const routeConfigs = [];
    const actions = createFakeActions(routeConfigs, pluginContentDir);

    await plugin.contentLoaded({
      content,
      actions,
    });

    expect(routeConfigs).not.toEqual([]);
    expect(routeConfigs).toMatchSnapshot();
  });
});
