/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import {normalizePluginOptions} from '@docusaurus/utils-validation';
import {posixPath, getFileCommitDate} from '@docusaurus/utils';
import pluginContentBlog from '../index';
import {validateOptions} from '../options';
import type {
  DocusaurusConfig,
  LoadContext,
  I18n,
  Validate,
} from '@docusaurus/types';
import type {
  BlogPost,
  Options,
  PluginOptions,
  EditUrlFunction,
} from '@docusaurus/plugin-content-blog';

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
      formattedDate: 'January 1, 2019',
      frontMatter: {
        date: new Date('2019-01-01'),
        tags: ['date'],
      },
      prevItem: undefined,
      tags: [
        {
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
        },
        {
          email: 'lorber.sebastien@gmail.com',
          key: 'slorber',
          name: 'Sébastien Lorber (translated)',
          title: 'Docusaurus maintainer (translated)',
        },
      ],
      date: new Date('2018-12-14'),
      formattedDate: 'December 14, 2018',
      frontMatter: {
        authors: [
          {
            name: 'Yangshun Tay (translated)',
          },
          'slorber',
        ],
        title: 'Happy 1st Birthday Slash! (translated)',
      },
      tags: [],
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
      formattedDate: 'August 16, 2020',
      frontMatter: {
        date: '2020/08/16',
        slug: '/hey/my super path/héllô',
        title: 'Complex Slug',
        tags: ['date', 'complex'],
      },
      tags: [
        {
          label: 'date',
          permalink: '/blog/tags/date',
        },
        {
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
        },
      ],
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/draft',
        title: 'draft',
      },
      date: new Date('2020-08-15'),
      formattedDate: 'August 15, 2020',
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
      formattedDate: 'January 2, 2019',
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

  it('builds simple website blog with localized dates', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPostsFrench = await getBlogPosts(siteDir, {}, getI18n('fr'));
    expect(blogPostsFrench).toHaveLength(10);
    expect(blogPostsFrench[0]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"23 juillet 2023"`,
    );
    expect(blogPostsFrench[1]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"6 mars 2021"`,
    );
    expect(blogPostsFrench[2]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"5 mars 2021"`,
    );
    expect(blogPostsFrench[3]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"16 août 2020"`,
    );
    expect(blogPostsFrench[4]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"15 août 2020"`,
    );
    expect(blogPostsFrench[5]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"27 février 2020"`,
    );
    expect(blogPostsFrench[6]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"27 février 2020"`,
    );
    expect(blogPostsFrench[7]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"2 janvier 2019"`,
    );
    expect(blogPostsFrench[8]!.metadata.formattedDate).toMatchInlineSnapshot(
      `"1 janvier 2019"`,
    );
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
    const result = getFileCommitDate(noDateSourceFile, {age: 'oldest'});
    const noDateSourceTime = result.date;
    const formattedDate = Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(noDateSourceTime);

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
      formattedDate,
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
});
