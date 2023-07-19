/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import {load as cheerioLoad} from 'cheerio';
import {readOutputHTMLFile} from '@docusaurus/utils';
import {blogPostContainerID} from '@docusaurus/utils-common';
import {DEFAULT_OPTIONS} from '../options';
import {generateBlogPosts} from '../blogUtils';
import {
  createBlogFeedFiles,
  defaultCreateFeedItems as feedDefaultCreateFeedItems,
} from '../feed';
import type {LoadContext, I18n, DocusaurusConfig} from '@docusaurus/types';
import type {BlogContentPaths} from '../types';
import type {BlogPost, PluginOptions} from '@docusaurus/plugin-content-blog';

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

function isFullAbsolutePath(str: string) {
  const domain = 'https://domain.com';
  const {origin} = new URL(str, domain);
  return origin !== domain;
}

async function generateLinksOfBlogPosts(outDir: string, blogPosts: BlogPost[]) {
  const linksOfBlogPosts: {[postId: string]: string[]} = {};
  const pathOfFile = path.join(outDir, 'blog');
  const promises = blogPosts.map(async (post) => {
    try {
      const content = await readOutputHTMLFile(post.id, pathOfFile, true);
      const $ = cheerioLoad(content);
      const anchorElements = $(`div#${blogPostContainerID} a`);
      if (anchorElements.length > 0) {
        const href = anchorElements.map((_, elm) => elm.attribs.href).toArray();
        linksOfBlogPosts[post.id] = href;
      }
    } catch {
      // post is a draft
    }
  });
  await Promise.all(promises);
  return linksOfBlogPosts;
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
});

describe('Test defaultCreateFeedItems', () => {
  const fsMock = jest.spyOn(fs, 'outputFile').mockImplementation(() => {});
  it('links in feeds are resolved correctly', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const outDir = path.join(siteDir, 'build-snap');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/myBaseUrl/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
    } as DocusaurusConfig;

    const context = {
      siteDir,
      siteConfig,
      i18n: DefaultI18N,
      outDir,
    } as LoadContext;

    const options = {
      path: 'blog',
      routeBasePath: 'blog',
      tagsBasePath: 'tags',
      authorsMapPath: 'authors.yml',
      include: DEFAULT_OPTIONS.include,
      exclude: DEFAULT_OPTIONS.exclude,
      feedOptions: {
        type: ['atom', 'rss', 'json'],
        copyright: 'Copyright',
      },
      readingTime: ({content, defaultReadingTime}) =>
        defaultReadingTime({content}),
      truncateMarker: /<!--\s*truncate\s*-->/,
    } as PluginOptions;

    const blogPosts = await generateBlogPosts(
      getBlogContentPaths(siteDir),
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

    const originalLinksInBlogs: {[id: string]: Array<string>} =
      await generateLinksOfBlogPosts(outDir, blogPosts);

    const blogPostsWithLinks = blogPosts.filter(
      (post) => originalLinksInBlogs[post.id],
    );

    const feedsWithLinks = await feedDefaultCreateFeedItems({
      blogPosts: blogPostsWithLinks,
      siteConfig,
      outDir,
    });

    feedsWithLinks.forEach((feed) => {
      const $ = cheerioLoad(feed.content ?? '');
      const linksInFeed = $('a')
        .map((_, elm) => elm.attribs.href)
        .toArray();
      const idOfBlogPost = feed.id!.replace(
        new URL(`${siteConfig.baseUrl}blog`, siteConfig.url).href,
        '',
      );
      const originalLinksInBlog = originalLinksInBlogs[idOfBlogPost];
      const {permalink = ''} =
        blogPostsWithLinks.find((post) => post.id === idOfBlogPost)?.metadata ||
        {};

      originalLinksInBlog!.forEach((originalLinkInBlog, idx) => {
        const linkToTest = isFullAbsolutePath(originalLinkInBlog)
          ? originalLinkInBlog
          : new URL(originalLinkInBlog, new URL(permalink, siteConfig.url))
              .href;

        expect(linkToTest).toEqual(linksInFeed[idx]);
      });
    });
    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });
});
