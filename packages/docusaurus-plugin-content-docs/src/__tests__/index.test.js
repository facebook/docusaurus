/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@babel/polyfill';
import path from 'path';
import loadSetup from '../../../docusaurus/lib/server/load/__tests__/loadSetup';
import DocusaurusPluginContentDocs from '../index';

describe('loadDocs', () => {
  test('simple website', async () => {
    const {siteDir, siteConfig} = await loadSetup('simple');
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = new DocusaurusPluginContentDocs(
      {
        siteDir,
        siteConfig,
      },
      {
        path: '../docs',
        sidebarPath,
      },
    );
    const {docs: docsMetadata} = await plugin.loadContent();
    const docsDir = plugin.contentPath;

    expect(docsMetadata.hello).toEqual({
      category: 'Guides',
      id: 'hello',
      permalink: '/docs/hello',
      previous: 'foo/baz',
      previous_title: 'baz',
      sidebar: 'docs',
      source: path.join(docsDir, 'hello.md'),
      title: 'Hello, World !',
    });
    expect(docsMetadata['foo/bar']).toEqual({
      category: 'Test',
      id: 'foo/bar',
      next: 'foo/baz',
      next_title: 'baz',
      permalink: '/docs/foo/bar',
      sidebar: 'docs',
      source: path.join(docsDir, 'foo', 'bar.md'),
      title: 'Bar',
    });
  });
});
