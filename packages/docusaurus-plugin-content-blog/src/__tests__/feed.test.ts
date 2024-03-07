/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import {DEFAULT_PARSE_FRONT_MATTER} from '@docusaurus/utils';
import {DEFAULT_OPTIONS} from '../options';
import {generateBlogPosts} from '../blogUtils';
import {createBlogFeedFiles} from '../feed';
import type {
  LoadContext,
  I18n,
  DocusaurusConfig,
  MarkdownConfig,
  RouterType,
} from '@docusaurus/types';
import type {BlogContentPaths} from '../types';
import type {FeedType, PluginOptions} from '@docusaurus/plugin-content-blog';

const DefaultI18N: I18n = {
  currentLocale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
  path: '1i8n',
  localeConfigs: {
    en: {
      label: 'English',
      direction: 'ltr',
      htmlLang: 'en',
      calendar: 'gregory',
      path: 'en',
    },
  },
};

function partial<T>(t: Partial<T>): T {
  return t as T;
}

const markdown = partial<MarkdownConfig>({
  parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
});

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
): Promise<void> {
  const blogPosts = await generateBlogPosts(
    getBlogContentPaths(context.siteDir),
    context,
    options,
  );

  await createBlogFeedFiles({
    blogPosts,
    options,
    siteConfig: context.siteConfig,
    outDir: context.outDir,
    locale: 'en',
  });
}

function pluginOptions(
  feedType: FeedType,
  options: Partial<PluginOptions> = {},
): PluginOptions {
  return partial<PluginOptions>({
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
    truncateMarker: /<!--\s*truncate\s*-->/,
    ...options,
  });
}

function siteFor(
  siteDir: string,
  siteOptions?: {baseUrl?: string; router?: RouterType},
) {
  const siteConfig = partial<DocusaurusConfig>({
    title: 'Hello',
    router: siteOptions?.router,
    baseUrl: siteOptions?.baseUrl,
    url: 'https://docusaurus.io',
    favicon: 'image/favicon.ico',
    markdown,
  });
  const outDir = path.join(siteDir, 'build-snap');
  const loadContext = partial<LoadContext>({
    siteDir,
    siteConfig,
    i18n: DefaultI18N,
    outDir,
  });
  return {siteConfig, outDir, loadContext};
}

describe.each(['atom', 'rss', 'json'] as FeedType[])('%s', (feedType) => {
  const fsMock = jest.spyOn(fs, 'outputFile').mockImplementation(() => {});

  it('does not get generated without posts', async () => {
    const {loadContext} = siteFor(__dirname);

    await testGenerateFeeds(
      loadContext,
      pluginOptions(feedType, {
        path: 'invalid-blog-path',
      }),
    );

    expect(fsMock).toHaveBeenCalledTimes(0);
    fsMock.mockClear();
  });

  it('has feed item for each post', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const {loadContext} = siteFor(siteDir, {baseUrl: '/myBaseUrl/'});

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(loadContext, pluginOptions(feedType));

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('has feed item for each post using hash router', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const {loadContext} = siteFor(siteDir, {
      baseUrl: '/myBaseUrl/',
      router: 'hash',
    });

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(loadContext, pluginOptions(feedType));

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('filters to the first two entries', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const {loadContext} = siteFor(siteDir, {
      baseUrl: '/myBaseUrl/',
    });

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      loadContext,
      pluginOptions(feedType, {
        feedOptions: {
          type: [feedType],
          copyright: 'Copyright',
          createFeedItems: async (params) => {
            const {blogPosts, defaultCreateFeedItems, ...rest} = params;
            const blogPostsFiltered = blogPosts.filter(
              (item, index) => index < 2,
            );
            return defaultCreateFeedItems({
              blogPosts: blogPostsFiltered,
              ...rest,
            });
          },
        },
      }),
    );

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('filters to the first two entries using limit', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const {loadContext} = siteFor(siteDir, {
      baseUrl: '/myBaseUrl/',
    });

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      loadContext,
      pluginOptions(feedType, {
        feedOptions: {
          type: [feedType],
          copyright: 'Copyright',
          limit: 2,
        },
      }),
    );

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });
});
