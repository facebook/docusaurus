/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import pluginContentPages from '../index';
import {LoadContext} from '@docusaurus/types';

describe('docusaurus-plugin-content-pages', () => {
  test('simple pages', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
    };
    const context = {
      siteDir,
      siteConfig,
    } as LoadContext;
    const pluginPath = 'src/pages';
    const plugin = pluginContentPages(context, {
      path: pluginPath,
    });
    const pagesMetadatas = await plugin.loadContent();

    expect(pagesMetadatas).toEqual([
      {
        permalink: '/',
        source: path.join('@site', pluginPath, 'index.js'),
      },
      {
        permalink: '/hello/world',
        source: path.join('@site', pluginPath, 'hello', 'world.js'),
      },
    ]);
  });
});
