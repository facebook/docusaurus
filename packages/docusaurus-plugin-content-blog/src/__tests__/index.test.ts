/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {
  posixPath,
  getFileCommitDate,
  LAST_UPDATE_FALLBACK,
} from '@docusaurus/utils';
import pluginContentBlog from '../index';
import {validateOptions} from '../options';
import type {
  DocusaurusConfig,
  LoadContext,
  I18n,
  Validate,
  MarkdownConfig,
} from '@docusaurus/types';
import type {
  BlogPost,
  Options,
  PluginOptions,
  EditUrlFunction,
} from '@docusaurus/plugin-content-blog';

const markdown: MarkdownConfig = {
  format: 'mdx',
  mermaid: true,
  mdx1Compat: {
    comments: true,
    headingIds: true,
    admonitions: true,
  },
  parseFrontMatter: async (params) => {
    // Reuse the default parser
    const result = await params.defaultParseFrontMatter(params);
    if (result.frontMatter.title === 'Complex Slug') {
      result.frontMatter.custom_frontMatter = 'added by parseFrontMatter';
    }
    return result;
  },
  remarkRehypeOptions: undefined,
};

function findByTitle(
  blogPosts: BlogPost[],
  title: string,
): BlogPost | undefined {
  return blogPosts.find((v) => v.metadata.title === title);
}

function getByTitle(blogPosts: BlogPost[], title: string): BlogPost {
  const post = findByTitle(blogPosts, title);
  if (!post) {
    throw new Error(`can't find blog post with title ${title}.
Available blog post titles are:\n- ${blogPosts
      .map((p) => p.metadata.title)
      .join('\n- ')}`);
  }
  return post;
}

function getI18n(locale: string): I18n {
  return {
    currentLocale: locale,
    locales: [locale],
    defaultLocale: locale,
    path: 'i18n',
    localeConfigs: {
      [locale]: {
        calendar: 'gregory',
        label: locale,
        htmlLang: locale,
        direction: 'ltr',
        path: locale,
      },
    },
  };
}

const DefaultI18N: I18n = getI18n('en');

const PluginPath = 'blog';

const BaseEditUrl = 'https://baseEditUrl.com/edit';

const getPlugin = async (
  siteDir: string,
  pluginOptions: Partial<PluginOptions> = {},
  i18n: I18n = DefaultI18N,
) => {
  const generatedFilesDir: string = path.resolve(siteDir, '.docusaurus');
  const localizationDir = path.join(
    siteDir,
    i18n.path,
    i18n.localeConfigs[i18n.currentLocale]!.path,
  );
  const siteConfig = {
    title: 'Hello',
    baseUrl: '/',
    url: 'https://docusaurus.io',
    markdown,
    future: {},
  } as DocusaurusConfig;
  return pluginContentBlog(
    {
      siteDir,
      siteConfig,
      generatedFilesDir,
      i18n,
      localizationDir,
    } as LoadContext,
    validateOptions({
      validate: normalizePluginOptions as Validate<
        Options | undefined,
        PluginOptions
      >,
      options: {
        path: PluginPath,
        editUrl: BaseEditUrl,
        ...pluginOptions,
      },
    }),
  );
};

const getBlogPosts = async (
  siteDir: string,
  pluginOptions: Partial<PluginOptions> = {},
  i18n: I18n = DefaultI18N,
) => {
  const plugin = await getPlugin(siteDir, pluginOptions, i18n);
  const {blogPosts} = (await plugin.loadContent!())!;
  return blogPosts;
};

const getBlogTags = async (
  siteDir: string,
  pluginOptions: Partial<PluginOptions> = {},
  i18n: I18n = DefaultI18N,
) => {
  const plugin = await getPlugin(siteDir, pluginOptions, i18n);
  const {blogTags} = (await plugin.loadContent!())!;
  return blogTags;
};

describe('blog plugin', () => {
  it('getPathsToWatch returns right files', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const plugin = await getPlugin(siteDir);
    const pathsToWatch = plugin.getPathsToWatch!();
    const relativePathsToWatch = pathsToWatch.map((p) =>
      posixPath(path.relative(siteDir, p)),
    );
    expect(relativePathsToWatch).toEqual([
      'i18n/en/docusaurus-plugin-content-blog/authors.yml',
      'i18n/en/docusaurus-plugin-content-blog/tags.yml',
      'blog/tags.yml',
      'i18n/en/docusaurus-plugin-content-blog/**/*.{md,mdx}',
      'blog/**/*.{md,mdx}',
    ]);
  });

  it('builds a simple website', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPosts = await getBlogPosts(siteDir);

    expect({
      ...getByTitle(blogPosts, 'date-matter').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl: `${BaseEditUrl}/blog/date-matter.md`,
      permalink: '/blog/date-matter',
      readingTime: 0.02,
      source: path.posix.join('@site', PluginPath, 'date-matter.md'),
      title: 'date-matter',
      description: `date inside front matter`,
      authors: [],
      date: new Date('2019-01-01'),
      frontMatter: {
        date: new Date('2019-01-01'),
        tags: ['date'],
      },
      prevItem: undefined,
      tags: [
        {
          description: undefined,
          inline: true,
          label: 'date',
          permalink: '/blog/tags/date',
        },
      ],
      nextItem: {
        permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
        title: 'Happy 1st Birthday Slash! (translated)',
      },
      hasTruncateMarker: false,
      unlisted: false,
    });

    expect(
      getByTitle(blogPosts, 'Happy 1st Birthday Slash! (translated)').metadata,
    ).toEqual({
      editUrl: `${BaseEditUrl}/blog/2018-12-14-Happy-First-Birthday-Slash.md`,
      permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
      readingTime: 0.015,
      source: path.posix.join(
        '@site',
        path.posix.join('i18n', 'en', 'docusaurus-plugin-content-blog'),
        '2018-12-14-Happy-First-Birthday-Slash.md',
      ),
      title: 'Happy 1st Birthday Slash! (translated)',
      description: `Happy birthday! (translated)`,
      authors: [
        {
          name: 'Yangshun Tay (translated)',
          imageURL: undefined,
          key: null,
          page: null,
        },
        {
          email: 'lorber.sebastien@gmail.com',
          key: 'slorber',
          name: 'Sébastien Lorber (translated)',
          title: 'Docusaurus maintainer (translated)',
          imageURL: undefined,
          page: {permalink: '/blog/authors/slorber-custom-permalink-localized'},
        },
      ],
      date: new Date('2018-12-14'),
      frontMatter: {
        authors: [
          {
            name: 'Yangshun Tay (translated)',
          },
          'slorber',
        ],
        tags: ['inlineTag', 'globalTag'],
        title: 'Happy 1st Birthday Slash! (translated)',
      },
      tags: [
        {
          description: undefined,
          inline: true,
          label: 'inlineTag',
          permalink: '/blog/tags/inline-tag',
        },
        {
          description: 'Global Tag description (en)',
          inline: false,
          label: 'Global Tag label (en)',
          permalink: '/blog/tags/global-tag-permalink (en)',
        },
      ],
      prevItem: {
        permalink: '/blog/date-matter',
        title: 'date-matter',
      },
      hasTruncateMarker: false,
      unlisted: false,
    });

    expect({
      ...getByTitle(blogPosts, 'Complex Slug').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl: `${BaseEditUrl}/blog/complex-slug.md`,
      permalink: '/blog/hey/my super path/héllô',
      readingTime: 0.015,
      source: path.posix.join('@site', PluginPath, 'complex-slug.md'),
      title: 'Complex Slug',
      description: `complex url slug`,
      authors: [],
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/simple/slug',
        title: 'Simple Slug',
      },
      date: new Date('2020-08-16'),
      frontMatter: {
        date: '2020/08/16',
        slug: '/hey/my super path/héllô',
        title: 'Complex Slug',
        tags: ['date', 'complex'],
        custom_frontMatter: 'added by parseFrontMatter',
      },
      tags: [
        {
          description: undefined,
          inline: true,
          label: 'date',
          permalink: '/blog/tags/date',
        },
        {
          description: undefined,
          inline: true,
          label: 'complex',
          permalink: '/blog/tags/complex',
        },
      ],
      hasTruncateMarker: false,
      unlisted: false,
    });

    expect({
      ...getByTitle(blogPosts, 'Simple Slug').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl: `${BaseEditUrl}/blog/simple-slug.md`,
      permalink: '/blog/simple/slug',
      readingTime: 0.015,
      source: path.posix.join('@site', PluginPath, 'simple-slug.md'),
      title: 'Simple Slug',
      description: `simple url slug`,
      authors: [
        {
          name: 'Sébastien Lorber',
          title: 'Docusaurus maintainer',
          url: 'https://sebastienlorber.com',
          imageURL: undefined,
          page: null,
          key: null,
        },
      ],
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/draft',
        title: 'draft',
      },
      date: new Date('2020-08-15'),
      frontMatter: {
        author: 'Sébastien Lorber',
        author_title: 'Docusaurus maintainer',
        author_url: 'https://sebastienlorber.com',
        date: new Date('2020-08-15'),
        slug: '/simple/slug',
        title: 'Simple Slug',
      },
      tags: [],
      hasTruncateMarker: false,
      unlisted: false,
    });

    expect({
      ...getByTitle(blogPosts, 'some heading').metadata,
      prevItem: undefined,
    }).toEqual({
      editUrl: `${BaseEditUrl}/blog/heading-as-title.md`,
      permalink: '/blog/heading-as-title',
      readingTime: 0,
      source: path.posix.join('@site', PluginPath, 'heading-as-title.md'),
      title: 'some heading',
      description: '',
      authors: [],
      date: new Date('2019-01-02'),
      frontMatter: {
        date: new Date('2019-01-02'),
      },
      prevItem: undefined,
      tags: [],
      nextItem: {
        permalink: '/blog/date-matter',
        title: 'date-matter',
      },
      hasTruncateMarker: false,
      unlisted: false,
    });
  });

  it('handles edit URL with editLocalizedBlogs: true', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPosts = await getBlogPosts(siteDir, {editLocalizedFiles: true});

    const localizedBlogPost = blogPosts.find(
      (v) => v.metadata.title === 'Happy 1st Birthday Slash! (translated)',
    )!;

    expect(localizedBlogPost.metadata.editUrl).toBe(
      `${BaseEditUrl}/i18n/en/docusaurus-plugin-content-blog/2018-12-14-Happy-First-Birthday-Slash.md`,
    );
  });

  it('handles edit URL with editUrl function', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');

    const hardcodedEditUrl = 'hardcoded-edit-url';
    const editUrlFunction: EditUrlFunction = jest.fn(() => hardcodedEditUrl);

    const blogPosts = await getBlogPosts(siteDir, {editUrl: editUrlFunction});

    blogPosts.forEach((blogPost) => {
      expect(blogPost.metadata.editUrl).toEqual(hardcodedEditUrl);
    });

    expect(editUrlFunction).toHaveBeenCalledTimes(10);

    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'blog',
      blogPath: 'date-matter.md',
      permalink: '/blog/date-matter',
      locale: 'en',
    });
    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'blog',
      blogPath: 'draft.md',
      permalink: '/blog/draft',
      locale: 'en',
    });
    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'blog',
      blogPath: 'mdx-blog-post.mdx',
      permalink: '/blog/mdx-blog-post',
      locale: 'en',
    });
    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'blog',
      blogPath: 'mdx-require-blog-post.mdx',
      permalink: '/blog/mdx-require-blog-post',
      locale: 'en',
    });
    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'blog',
      blogPath: 'complex-slug.md',
      permalink: '/blog/hey/my super path/héllô',
      locale: 'en',
    });
    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'blog',
      blogPath: 'simple-slug.md',
      permalink: '/blog/simple/slug',
      locale: 'en',
    });
    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'i18n/en/docusaurus-plugin-content-blog',
      blogPath: '2018-12-14-Happy-First-Birthday-Slash.md',
      permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
      locale: 'en',
    });
    expect(editUrlFunction).toHaveBeenCalledWith({
      blogDirPath: 'blog',
      blogPath: 'heading-as-title.md',
      locale: 'en',
      permalink: '/blog/heading-as-title',
    });
  });

  it('excludes draft blog post from production build', async () => {
    const originalEnv = process.env;
    jest.resetModules();
    process.env = {...originalEnv, NODE_ENV: 'production'};
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPosts = await getBlogPosts(siteDir);

    expect(blogPosts.find((v) => v.metadata.title === 'draft')).toBeUndefined();
    process.env = originalEnv;
  });

  it('creates blog post without date', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'website-blog-without-date',
    );
    const blogPosts = await getBlogPosts(siteDir);
    const noDateSource = path.posix.join('@site', PluginPath, 'no date.md');
    const noDateSourceFile = path.posix.join(siteDir, PluginPath, 'no date.md');
    // We know the file exists and we know we have git
    const result = await getFileCommitDate(noDateSourceFile, {age: 'oldest'});
    const noDateSourceTime = result.date;

    expect({
      ...getByTitle(blogPosts, 'no date').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl: `${BaseEditUrl}/blog/no date.md`,
      permalink: '/blog/no date',
      readingTime: 0.01,
      source: noDateSource,
      title: 'no date',
      description: `no date`,
      authors: [],
      date: noDateSourceTime,
      frontMatter: {},
      tags: [],
      prevItem: undefined,
      nextItem: undefined,
      hasTruncateMarker: false,
      unlisted: false,
    });
  });

  it('can sort blog posts in ascending order', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const normalOrder = await getBlogPosts(siteDir);
    const reversedOrder = await getBlogPosts(siteDir, {
      sortPosts: 'ascending',
    });
    expect(normalOrder.reverse().map((x) => x.metadata.date)).toEqual(
      reversedOrder.map((x) => x.metadata.date),
    );
  });

  it('works with blog tags', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'website-blog-with-tags',
    );
    const blogTags = await getBlogTags(siteDir, {
      postsPerPage: 2,
    });

    expect(Object.keys(blogTags)).toHaveLength(3);
    expect(blogTags).toMatchSnapshot();
  });

  it('works on blog tags without pagination', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'website-blog-with-tags',
    );
    const blogTags = await getBlogTags(siteDir, {
      postsPerPage: 'ALL',
    });

    expect(blogTags).toMatchSnapshot();
  });

  it('process blog posts load content', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'website-blog-with-tags',
    );
    const plugin = await getPlugin(
      siteDir,
      {
        postsPerPage: 1,
        processBlogPosts: async ({blogPosts}) =>
          blogPosts.filter((blog) => blog.metadata.tags[0]?.label === 'tag1'),
        onInlineTags: 'ignore',
        tags: false,
      },
      DefaultI18N,
    );
    const {blogPosts, blogTags, blogListPaginated} =
      (await plugin.loadContent!())!;

    expect(blogListPaginated).toHaveLength(3);

    expect(Object.keys(blogTags)).toHaveLength(2);
    expect(blogTags).toMatchSnapshot();

    expect(blogPosts).toHaveLength(3);
    expect(blogPosts).toMatchSnapshot();
  });
});

describe('last update', () => {
  const siteDir = path.join(
    __dirname,
    '__fixtures__',
    'website-blog-with-last-update',
  );

  const lastUpdateFor = (date: string) => new Date(date).getTime();

  it('author and time', async () => {
    const plugin = await getPlugin(
      siteDir,
      {
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
      DefaultI18N,
    );
    const {blogPosts} = (await plugin.loadContent!())!;

    expect(blogPosts[0]?.metadata.lastUpdatedBy).toBe('seb');
    expect(blogPosts[0]?.metadata.lastUpdatedAt).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedAt,
    );

    expect(blogPosts[1]?.metadata.lastUpdatedBy).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedBy,
    );
    expect(blogPosts[1]?.metadata.lastUpdatedAt).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedAt,
    );

    expect(blogPosts[2]?.metadata.lastUpdatedBy).toBe('seb');
    expect(blogPosts[2]?.metadata.lastUpdatedAt).toBe(
      lastUpdateFor('2021-01-01'),
    );

    expect(blogPosts[3]?.metadata.lastUpdatedBy).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedBy,
    );
    expect(blogPosts[3]?.metadata.lastUpdatedAt).toBe(
      lastUpdateFor('2021-01-01'),
    );
  });

  it('time only', async () => {
    const plugin = await getPlugin(
      siteDir,
      {
        showLastUpdateAuthor: false,
        showLastUpdateTime: true,
      },
      DefaultI18N,
    );
    const {blogPosts} = (await plugin.loadContent!())!;

    expect(blogPosts[0]?.metadata.title).toBe('Author');
    expect(blogPosts[0]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[0]?.metadata.lastUpdatedAt).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedAt,
    );

    expect(blogPosts[1]?.metadata.title).toBe('Nothing');
    expect(blogPosts[1]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[1]?.metadata.lastUpdatedAt).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedAt,
    );

    expect(blogPosts[2]?.metadata.title).toBe('Both');
    expect(blogPosts[2]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[2]?.metadata.lastUpdatedAt).toBe(
      lastUpdateFor('2021-01-01'),
    );

    expect(blogPosts[3]?.metadata.title).toBe('Last update date');
    expect(blogPosts[3]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[3]?.metadata.lastUpdatedAt).toBe(
      lastUpdateFor('2021-01-01'),
    );
  });

  it('author only', async () => {
    const plugin = await getPlugin(
      siteDir,
      {
        showLastUpdateAuthor: true,
        showLastUpdateTime: false,
      },
      DefaultI18N,
    );
    const {blogPosts} = (await plugin.loadContent!())!;

    expect(blogPosts[0]?.metadata.lastUpdatedBy).toBe('seb');
    expect(blogPosts[0]?.metadata.lastUpdatedAt).toBeUndefined();

    expect(blogPosts[1]?.metadata.lastUpdatedBy).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedBy,
    );
    expect(blogPosts[1]?.metadata.lastUpdatedAt).toBeUndefined();

    expect(blogPosts[2]?.metadata.lastUpdatedBy).toBe('seb');
    expect(blogPosts[2]?.metadata.lastUpdatedAt).toBeUndefined();

    expect(blogPosts[3]?.metadata.lastUpdatedBy).toBe(
      LAST_UPDATE_FALLBACK.lastUpdatedBy,
    );
    expect(blogPosts[3]?.metadata.lastUpdatedAt).toBeUndefined();
  });

  it('none', async () => {
    const plugin = await getPlugin(
      siteDir,
      {
        showLastUpdateAuthor: false,
        showLastUpdateTime: false,
      },
      DefaultI18N,
    );
    const {blogPosts} = (await plugin.loadContent!())!;

    expect(blogPosts[0]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[0]?.metadata.lastUpdatedAt).toBeUndefined();

    expect(blogPosts[1]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[1]?.metadata.lastUpdatedAt).toBeUndefined();

    expect(blogPosts[2]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[2]?.metadata.lastUpdatedAt).toBeUndefined();

    expect(blogPosts[3]?.metadata.lastUpdatedBy).toBeUndefined();
    expect(blogPosts[3]?.metadata.lastUpdatedAt).toBeUndefined();
  });
});
