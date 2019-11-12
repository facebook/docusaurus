/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {validate} from 'webpack';
import {isMatch} from 'picomatch';
import fs from 'fs-extra';
import pluginContentDocs from '../index';
import {loadContext} from '@docusaurus/core/src/server/index';
import {applyConfigureWebpack} from '@docusaurus/core/src/webpack/utils';
import {RouteConfig} from '@docusaurus/types';
import {posixPath} from '@docusaurus/utils';

const createFakeActions = (routeConfigs: RouteConfig[], contentDir) => {
  return {
    addRoute: (config: RouteConfig) => {
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
    const matchPattern = pathToWatch.map(filepath =>
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

test('bad versioned website', async () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'bad-site');
  const context = loadContext(siteDir);
  const plugin = pluginContentDocs(context, {});
  expect(plugin.loadContent()).rejects.toThrowErrorMatchingInlineSnapshot(
    `"You cannot have a folder named \\"version-1.0.0\\""`,
  );
});

/* TODO for versioning */
describe('versioned website', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'versioned-site');
  const context = loadContext(siteDir);
  const sidebarPath = path.join(siteDir, 'sidebars.json');
  const plugin = pluginContentDocs(context, {
    sidebarPath,
  });
  const pluginContentDir = path.join(context.generatedFilesDir, plugin.name);

  test('getPathToWatch', () => {
    const pathToWatch = plugin.getPathsToWatch();
    const matchPattern = pathToWatch.map(filepath =>
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
    const {docsMetadata, docsSidebars} = content;

    // TODO: expect docsMetadata.blabla.toEqual()

    // expect(docsSidebars).toMatchSnapshot();

    // const routeConfigs = [];
    // const actions = createFakeActions(routeConfigs, pluginContentDir);

    // await plugin.contentLoaded({
    //   content,
    //   actions,
    // });

    // expect(routeConfigs).not.toEqual([]);
    // expect(routeConfigs).toMatchSnapshot();
  });
});
