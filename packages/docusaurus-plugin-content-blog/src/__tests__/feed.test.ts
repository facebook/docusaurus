/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {
  DEFAULT_PARSE_FRONT_MATTER,
  DEFAULT_VCS_CONFIG,
} from '@docusaurus/utils';
import {fromPartial} from '@total-typescript/shoehorn';
import {
  normalizePluginOptions,
  getTagsFile,
} from '@docusaurus/utils-validation';
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
  contextInput: LoadContext,
  optionsInput: Options,
): Promise<void> {
  const options = validateOptions({
    validate: normalizePluginOptions as Validate<
      Options | undefined,
      PluginOptions
    >,
    options: optionsInput,
  });

  const context: LoadContext = {
    ...contextInput,
    siteConfig: {
      ...contextInput.siteConfig,
      future: {
        ...contextInput.siteConfig?.future,
        experimental_vcs: DEFAULT_VCS_CONFIG,
      },
    },
  };

  const contentPaths = getBlogContentPaths(context.siteDir);
  const authorsMap = await getAuthorsMap({
    contentPaths,
    authorsMapPath: options.authorsMapPath,
    authorsBaseRoutePath: '/authors',
    baseUrl: '/',
  });

  const tagsFile = await getTagsFile({contentPaths, tags: options.tags});

  const blogPosts = await generateBlogPosts(
    contentPaths,
    context,
    options,
    tagsFile,
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
  const fsMock = vi.spyOn(fs, 'outputFile').mockImplementation(() => {});

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

  it('emits trailing-slashed URLs in feed structure when trailingSlash is true', async () => {
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

    try {
      const feedContent = fsMock.mock.calls[0]?.[1] as string | undefined;
      expect(feedContent).toBeDefined();

      // Extract URLs from feed-structural positions only — post body HTML
      // legitimately may contain author-written non-slashed URLs, so we ignore
      // CDATA sections for XML formats and content_html for JSON.
      const blogUrlPrefix = 'https://docusaurus.io/myBaseUrl/blog/';
      let structuralUrls: string[] = [];

      if (feedType === 'atom' || feedType === 'rss') {
        const xmlOnly = feedContent!.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');
        if (feedType === 'atom') {
          structuralUrls = [
            ...[...xmlOnly.matchAll(/<id>(?<url>[^<]+)<\/id>/g)].map(
              (m) => m.groups!.url!,
            ),
            ...[...xmlOnly.matchAll(/<link[^>]*href="(?<url>[^"]+)"/g)].map(
              (m) => m.groups!.url!,
            ),
          ];
        } else {
          structuralUrls = [
            ...[...xmlOnly.matchAll(/<link>(?<url>[^<]+)<\/link>/g)].map(
              (m) => m.groups!.url!,
            ),
            ...[...xmlOnly.matchAll(/<guid[^>]*>(?<url>[^<]+)<\/guid>/g)].map(
              (m) => m.groups!.url!,
            ),
          ];
        }
      } else {
        const parsed = JSON.parse(feedContent!) as {
          home_page_url?: string;
          feed_url?: string;
          items: {id: string; url: string}[];
        };
        structuralUrls = [
          parsed.home_page_url,
          parsed.feed_url,
          ...parsed.items.flatMap((item) => [item.id, item.url]),
        ].filter((u): u is string => typeof u === 'string');
      }

      const blogUrls = structuralUrls.filter((url) =>
        url.startsWith(blogUrlPrefix),
      );

      // Sanity: confirm we actually checked something.
      expect(blogUrls.length).toBeGreaterThan(0);

      for (const url of blogUrls) {
        expect(url, `${feedType} feed URL should end with "/"`).toMatch(/\/$/);
      }
    } finally {
      fsMock.mockClear();
    }
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
