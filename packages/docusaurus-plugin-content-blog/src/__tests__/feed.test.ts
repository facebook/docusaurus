/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import {DEFAULT_OPTIONS} from '../options';
import {generateBlogPosts} from '../blogUtils';
import {createBlogFeedFiles} from '../feed';
import type {LoadContext, I18n} from '@docusaurus/types';
import type {BlogContentPaths} from '../types';
import type {PluginOptions} from '@docusaurus/plugin-content-blog';

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

describe.each(['atom', 'rss', 'json'])('%s', (feedType) => {
  const fsMock = jest.spyOn(fs, 'outputFile').mockImplementation(() => {});

  it('does not get generated without posts', async () => {
    const siteDir = __dirname;
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
    };
    const outDir = path.join(siteDir, 'build-snap');

    await testGenerateFeeds(
      {
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
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
        truncateMarker: /<!--\s*truncate\s*-->/,
      } as PluginOptions,
    );

    expect(fsMock).toHaveBeenCalledTimes(0);
    fsMock.mockClear();
  });

  it('has feed item for each post', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const outDir = path.join(siteDir, 'build-snap');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/myBaseUrl/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      {
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
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
        truncateMarker: /<!--\s*truncate\s*-->/,
      } as PluginOptions,
    );

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('filters to the first two entries', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const outDir = path.join(siteDir, 'build-snap');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/myBaseUrl/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      {
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
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
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content}),
        truncateMarker: /<!--\s*truncate\s*-->/,
      } as PluginOptions,
    );

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('filters to the first two entries using limit', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const outDir = path.join(siteDir, 'build-snap');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/myBaseUrl/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      {
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
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
          limit: 2,
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content}),
        truncateMarker: /<!--\s*truncate\s*-->/,
      } as PluginOptions,
    );

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });
});
