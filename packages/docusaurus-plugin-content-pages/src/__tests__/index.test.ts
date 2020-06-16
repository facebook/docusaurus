/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadContext} from '@docusaurus/core/lib/server';

import pluginContentPages from '../index';

describe('docusaurus-plugin-content-pages', () => {
  test('simple pages', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = loadContext(siteDir);
    const pluginPath = 'src/pages';
    const plugin = pluginContentPages(context, {
      path: pluginPath,
    });

    const pagesMetadatas = await plugin.loadContent();

    expect(pagesMetadatas).toEqual([
      {
        type: 'jsx',
        permalink: '/',
        source: path.join('@site', pluginPath, 'index.js'),
      },
      {
        type: 'jsx',
        permalink: '/typescript',
        source: path.join('@site', pluginPath, 'typescript.tsx'),
      },
      {
        type: 'mdx',
        permalink: '/hello/',
        source: path.join('@site', pluginPath, 'hello', 'index.md'),
      },
      {
        type: 'mdx',
        permalink: '/hello/mdxPage',
        source: path.join('@site', pluginPath, 'hello', 'mdxPage.mdx'),
      },
      {
        type: 'jsx',
        permalink: '/hello/world',
        source: path.join('@site', pluginPath, 'hello', 'world.js'),
      },
    ]);
  });
});
