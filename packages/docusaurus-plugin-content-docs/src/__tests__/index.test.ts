/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';

import pluginContentDocs from '../index';
import {LoadContext} from '@docusaurus/types';

describe('loadDocs', () => {
  test('simple website', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const generatedFilesDir: string = path.resolve(siteDir, '.docusaurus');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
    };
    const context = {
      siteDir,
      siteConfig,
      generatedFilesDir,
    } as LoadContext;
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const pluginPath = 'docs';
    const plugin = pluginContentDocs(context, {
      path: pluginPath,
      sidebarPath,
    });
    const {docsMetadata} = await plugin.loadContent();

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
      sidebarCollapsible: true,
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
      sidebarCollapsible: true,
    });
  });
});
