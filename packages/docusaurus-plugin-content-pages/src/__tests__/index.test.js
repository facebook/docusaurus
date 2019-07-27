/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import pluginContentPages from '../index';

describe('docusaurus-plugin-content-pages', () => {
  test('simple pages', async () => {
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
    };
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const plugin = pluginContentPages({
      siteDir,
      siteConfig,
    });
    const pagesMetadatas = await plugin.loadContent();
    const pagesPath = path.relative(siteDir, plugin.contentPath);
    expect(pagesMetadatas).toEqual([
      {
        permalink: '/',
        source: path.join('@site', pagesPath, 'index.js'),
      },
      {
        permalink: '/hello/world',
        source: path.join('@site', pagesPath, 'hello', 'world.js'),
      },
    ]);
  });
});
