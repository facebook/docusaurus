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
import {fromPartial} from '@total-typescript/shoehorn';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import tree from 'tree-node-cli';
import {DEFAULT_OPTIONS, validateOptions} from '../options';
import {generateBlogPosts} from '../blogUtils';
import {createBlogFeedFiles} from '../feed';
import {getAuthorsMap} from '../authorsMap';
import type {LoadContext, I18n, Validate} from '@docusaurus/types';
import type {BlogContentPaths} from '../types';
import type {Options, PluginOptions} from '@docusaurus/plugin-content-blog';

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

const markdown = {parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER};

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
  optionsInput: Options,
): Promise<void> {
  const options = validateOptions({
    validate: normalizePluginOptions as Validate<
      Options | undefined,
      PluginOptions
    >,
    options: optionsInput,
  });

  const contentPaths = getBlogContentPaths(context.siteDir);
  const authorsMap = await getAuthorsMap({
    contentPaths,
    authorsMapPath: options.authorsMapPath,
    authorsBaseRoutePath: '/authors',
    baseUrl: '/',
  });

  const blogPosts = await generateBlogPosts(
    contentPaths,
    context,
    options,
    authorsMap,
  );

  await createBlogFeedFiles({
    blogPosts,
    options,
    siteConfig: context.siteConfig,
    outDir: context.outDir,
    locale: 'en',
    contentPaths,
  });
}

describe.each(['atom', 'rss', 'json'] as const)('%s', (feedType) => {
  const fsMock = jest.spyOn(fs, 'outputFile').mockImplementation(() => {});

  it('does not get generated without posts', async () => {
    const siteDir = __dirname;
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
      markdown,
    };
    const outDir = path.join(siteDir, 'build-snap');

    await testGenerateFeeds(
      fromPartial({
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
      }),
      {
        path: 'invalid-blog-path',
        routeBasePath: 'blog',
        tagsBasePath: 'tags',
        authorsMapPath: 'authors.yml',
        include: ['*.md', '*.mdx'],
        feedOptions: {
          type: [feedType],
          copyright: 'Copyright',
          xslt: {atom: null, rss: null},
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content, locale: 'en'}),
        truncateMarker: /<!--\s*truncate\s*-->/,
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
      },
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
      markdown,
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      fromPartial({
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
      }),
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
          xslt: {atom: null, rss: null},
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content, locale: 'en'}),
        truncateMarker: /<!--\s*truncate\s*-->/,
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
      },
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
      markdown,
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      fromPartial({
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
      }),
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
          xslt: {atom: null, rss: null},
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content, locale: 'en'}),
        truncateMarker: /<!--\s*truncate\s*-->/,
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
      },
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
      markdown,
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      fromPartial({
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
      }),
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
          xslt: {atom: null, rss: null},
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content, locale: 'en'}),
        truncateMarker: /<!--\s*truncate\s*-->/,
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
      },
    );

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('has feed item for each post - with trailing slash', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const outDir = path.join(siteDir, 'build-snap');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/myBaseUrl/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
      trailingSlash: true,
      markdown,
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      fromPartial({
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
      }),
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
          xslt: {atom: null, rss: null},
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content, locale: 'en'}),
        truncateMarker: /<!--\s*truncate\s*-->/,
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
      },
    );

    expect(
      fsMock.mock.calls.map((call) => call[1] as string),
    ).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('has xslt files for feed', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const outDir = path.join(siteDir, 'build-snap');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/myBaseUrl/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
      markdown,
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      fromPartial({
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
      }),
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
          xslt: true,
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content, locale: 'en'}),
        truncateMarker: /<!--\s*truncate\s*-->/,
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
      },
    );

    expect(tree(path.join(outDir, 'blog'))).toMatchSnapshot('blog tree');

    expect(fsMock.mock.calls).toMatchSnapshot();
    fsMock.mockClear();
  });

  it('has custom xslt files for feed', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const outDir = path.join(siteDir, 'build-snap');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/myBaseUrl/',
      url: 'https://docusaurus.io',
      favicon: 'image/favicon.ico',
      markdown,
    };

    // Build is quite difficult to mock, so we built the blog beforehand and
    // copied the output to the fixture...
    await testGenerateFeeds(
      fromPartial({
        siteDir,
        siteConfig,
        i18n: DefaultI18N,
        outDir,
      }),
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
          xslt: {
            rss: 'custom-rss.xsl',
            atom: 'custom-atom.xsl',
          },
        },
        readingTime: ({content, defaultReadingTime}) =>
          defaultReadingTime({content, locale: 'en'}),
        truncateMarker: /<!--\s*truncate\s*-->/,
        onInlineTags: 'ignore',
        onInlineAuthors: 'ignore',
      },
    );

    expect(tree(path.join(outDir, 'blog'))).toMatchSnapshot('blog tree');

    expect(fsMock.mock.calls).toMatchSnapshot();
    fsMock.mockClear();
  });
});
