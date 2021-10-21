/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {generateBlogFeed} from '../feed';
import {LoadContext, I18n} from '@docusaurus/types';
import {PluginOptions, BlogContentPaths} from '../types';
import {DEFAULT_OPTIONS} from '../pluginOptionSchema';
import {generateBlogPosts} from '../blogUtils';
import {Feed} from 'feed';

const DefaultI18N: I18n = {
  currentLocale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
  localeConfigs: {},
};

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

async function testGenerateFeeds(
  context: LoadContext,
  options: PluginOptions,
): Promise<Feed | null> {
  const blogPosts = await generateBlogPosts(
    getBlogContentPaths(context.siteDir),
    context,
    options,
  );

  return generateBlogFeed({
    blogPosts,
    options,
    siteConfig: context.siteConfig,
  });
}

describe('blogFeed', () => {
  (['atom', 'rss'] as const).forEach((feedType) => {
    describe(`${feedType}`, () => {
      test('should not show feed without posts', async () => {
        const siteDir = __dirname;
        const siteConfig = {
          title: 'Hello',
          baseUrl: '/',
          url: 'https://docusaurus.io',
          favicon: 'image/favicon.ico',
        };

        const feed = await testGenerateFeeds(
          {
            siteDir,
            siteConfig,
            i18n: DefaultI18N,
          } as LoadContext,
          {
            path: 'invalid-blog-path',
            routeBasePath: 'blog',
            tagsBasePath: 'tags',
            authorsMapPath: 'authors.yml',
            include: ['*.md', '*.mdx'],
            feedOptions: {
              type: [feedType],
              copyright: 'Copyright',
            },
            readingTime: ({content, defaultReadingTime}) =>
              defaultReadingTime({content}),
          } as PluginOptions,
        );

        expect(feed).toEqual(null);
      });

      test('shows feed item for each post', async () => {
        const siteDir = path.join(__dirname, '__fixtures__', 'website');
        const generatedFilesDir = path.resolve(siteDir, '.docusaurus');
        const siteConfig = {
          title: 'Hello',
          baseUrl: '/myBaseUrl/',
          url: 'https://docusaurus.io',
          favicon: 'image/favicon.ico',
        };

        const feed = await testGenerateFeeds(
          {
            siteDir,
            siteConfig,
            generatedFilesDir,
            i18n: DefaultI18N,
          } as LoadContext,
          {
            path: 'blog',
            routeBasePath: 'blog',
            tagsBasePath: 'tags',
            authorsMapPath: 'authors.yml',
            include: DEFAULT_OPTIONS.include,
            exclude: DEFAULT_OPTIONS.exclude,
            feedOptions: {
              type: [feedType],
              copyright: 'Copyright',
            },
            readingTime: ({content, defaultReadingTime}) =>
              defaultReadingTime({content}),
          } as PluginOptions,
        );
        const feedContent =
          feed && (feedType === 'rss' ? feed.rss2() : feed.atom1());
        expect(feedContent).toMatchSnapshot();
      });
    });
  });
});
