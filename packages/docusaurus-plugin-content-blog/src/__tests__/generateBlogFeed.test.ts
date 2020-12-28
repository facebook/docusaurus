/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {generateBlogFeed} from '../blogUtils';
import {LoadContext} from '@docusaurus/types';
import {PluginOptions, BlogContentPaths} from '../types';

function getBlogContentPaths(siteDir: string): BlogContentPaths {
  return {
    contentPath: path.resolve(siteDir, 'blog'),
    contentPathLocalized: path.resolve(
      siteDir,
      'i18n',
      'en',
      'docusaurus-plugin-content-blog',
    ),
  };
}

describe('blogFeed', () => {
  (['atom', 'rss'] as const).forEach((feedType) => {
    describe(`${feedType}`, () => {
      test('can show feed without posts', async () => {
        const siteDir = __dirname;
        const siteConfig = {
          title: 'Hello',
          baseUrl: '/',
          url: 'https://docusaurus.io',
          favicon: 'image/favicon.ico',
        };

        const feed = await generateBlogFeed(
          getBlogContentPaths(siteDir),
          {
            siteDir,
            siteConfig,
          } as LoadContext,
          {
            path: 'invalid-blog-path',
            routeBasePath: 'blog',
            include: ['*.md', '*.mdx'],
            feedOptions: {
              type: [feedType],
              copyright: 'Copyright',
            },
          } as PluginOptions,
        );
        const feedContent =
          feed && (feedType === 'rss' ? feed.rss2() : feed.atom1());
        expect(feedContent).toMatchSnapshot();
      });

      test('shows feed item for each post', async () => {
        const siteDir = path.join(__dirname, '__fixtures__', 'website');
        const generatedFilesDir = path.resolve(siteDir, '.docusaurus');
        const siteConfig = {
          title: 'Hello',
          baseUrl: '/',
          url: 'https://docusaurus.io',
          favicon: 'image/favicon.ico',
        };

        const feed = await generateBlogFeed(
          getBlogContentPaths(siteDir),
          {
            siteDir,
            siteConfig,
            generatedFilesDir,
          } as LoadContext,
          {
            path: 'blog',
            routeBasePath: 'blog',
            include: ['*r*.md', '*.mdx'], // skip no-date.md - it won't play nice with snapshots
            feedOptions: {
              type: [feedType],
              copyright: 'Copyright',
            },
          } as PluginOptions,
        );
        const feedContent =
          feed && (feedType === 'rss' ? feed.rss2() : feed.atom1());
        expect(feedContent).toMatchSnapshot();
      });
    });
  });
});
