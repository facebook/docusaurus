/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import pluginContentBlog from '../index';

describe('loadBlog', () => {
  test('simple website', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
    };
    const pluginPath = 'blog';
    const plugin = pluginContentBlog(
      {
        siteDir,
        siteConfig,
      },
      {
        path: 'blog',
      },
    );
    const {blogPosts} = await plugin.loadContent();

    expect(blogPosts[0].metadata).toEqual({
      permalink: '/blog/2019/01/01/date-matter',
      source: path.join('@site', pluginPath, 'date-matter.md'),
      title: 'date-matter',
      description: `date inside front matter`,
      date: new Date('2019-01-01'),
      tags: [],
    });
  });
});
