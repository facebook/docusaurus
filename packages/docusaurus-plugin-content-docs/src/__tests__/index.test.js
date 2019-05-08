/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import DocusaurusPluginContentDocs from '../index';

describe('loadDocs', () => {
  test('simple website', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
    };
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = new DocusaurusPluginContentDocs(
      {
        siteDir,
        siteConfig,
      },
      {
        path: 'docs',
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
