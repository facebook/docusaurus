/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import fs from 'fs-extra';
import path from 'path';
import pluginContentBlog from '../index';
import {DocusaurusConfig, LoadContext, I18n} from '@docusaurus/types';
import {PluginOptionSchema} from '../pluginOptionSchema';
import {PluginOptions, EditUrlFunction, BlogPost} from '../types';
import {Joi} from '@docusaurus/utils-validation';

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
    localeConfigs: {},
  };
}

const DefaultI18N: I18n = getI18n('en');

function validateAndNormalize(
  schema: Joi.ObjectSchema,
  options: Partial<PluginOptions>,
) {
  const {value, error} = schema.validate(options);
  if (error) {
    throw error;
  } else {
    return value;
  }
}

describe('loadBlog', () => {
  const PluginPath = 'blog';

  const BaseEditUrl = 'https://baseEditUrl.com/edit';

  const getBlogPosts = async (
    siteDir: string,
    pluginOptions: Partial<PluginOptions> = {},
    i18n: I18n = DefaultI18N,
  ) => {
    const generatedFilesDir: string = path.resolve(siteDir, '.docusaurus');
    const siteConfig = {
      title: 'Hello',
      baseUrl: '/',
      url: 'https://docusaurus.io',
    } as DocusaurusConfig;
    const plugin = pluginContentBlog(
      {
        siteDir,
        siteConfig,
        generatedFilesDir,
        i18n,
      } as LoadContext,
      validateAndNormalize(PluginOptionSchema, {
        path: PluginPath,
        editUrl: BaseEditUrl,
        ...pluginOptions,
      }),
    );
    const {blogPosts} = (await plugin.loadContent!())!;

    return blogPosts;
  };

  test('simple website', async () => {
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
      date: new Date('2019-01-01'),
      formattedDate: 'January 1, 2019',
      prevItem: undefined,
      tags: [],
      nextItem: {
        permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
        title: 'Happy 1st Birthday Slash! (translated)',
      },
      truncated: false,
    });

    expect(
      getByTitle(blogPosts, 'Happy 1st Birthday Slash! (translated)').metadata,
    ).toEqual({
      editUrl: `${BaseEditUrl}/blog/2018-12-14-Happy-First-Birthday-Slash.md`,
      permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
      readingTime: 0.015,
      source: path.posix.join(
        '@site',
        // pluginPath,
        path.posix.join('i18n', 'en', 'docusaurus-plugin-content-blog'),
        '2018-12-14-Happy-First-Birthday-Slash.md',
      ),
      title: 'Happy 1st Birthday Slash! (translated)',
      description: `Happy birthday! (translated)`,
      date: new Date('2018-12-14'),
      formattedDate: 'December 14, 2018',
      tags: [],
      prevItem: {
        permalink: '/blog/date-matter',
        title: 'date-matter',
      },
      truncated: false,
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
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/simple/slug',
        title: 'Simple Slug',
      },
      date: new Date('2020-08-16'),
      formattedDate: 'August 16, 2020',
      tags: [],
      truncated: false,
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
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/draft',
        title: 'draft',
      },
      date: new Date('2020-08-15'),
      formattedDate: 'August 15, 2020',
      tags: [],
      truncated: false,
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
      date: new Date('2019-01-02'),
      formattedDate: 'January 2, 2019',
      prevItem: undefined,
      tags: [],
      nextItem: {
        permalink: '/blog/date-matter',
        title: 'date-matter',
      },
      truncated: false,
    });
  });

  test('simple website blog dates localized', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPostsFrench = await getBlogPosts(siteDir, {}, getI18n('fr'));
    expect(blogPostsFrench).toHaveLength(6);
    expect(blogPostsFrench[0].metadata.formattedDate).toMatchInlineSnapshot(
      `"16 août 2020"`,
    );
    expect(blogPostsFrench[1].metadata.formattedDate).toMatchInlineSnapshot(
      `"15 août 2020"`,
    );
    expect(blogPostsFrench[2].metadata.formattedDate).toMatchInlineSnapshot(
      `"27 février 2020"`,
    );
    expect(blogPostsFrench[3].metadata.formattedDate).toMatchInlineSnapshot(
      `"2 janvier 2019"`,
    );
    expect(blogPostsFrench[4].metadata.formattedDate).toMatchInlineSnapshot(
      `"1 janvier 2019"`,
    );
    expect(blogPostsFrench[5].metadata.formattedDate).toMatchInlineSnapshot(
      `"14 décembre 2018"`,
    );
  });

  test('edit url with editLocalizedBlogs true', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPosts = await getBlogPosts(siteDir, {editLocalizedFiles: true});

    const localizedBlogPost = blogPosts.find(
      (v) => v.metadata.title === 'Happy 1st Birthday Slash! (translated)',
    )!;

    expect(localizedBlogPost.metadata.editUrl).toEqual(
      `${BaseEditUrl}/i18n/en/docusaurus-plugin-content-blog/2018-12-14-Happy-First-Birthday-Slash.md`,
    );
  });

  test('edit url with editUrl function', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');

    const hardcodedEditUrl = 'hardcoded-edit-url';
    const editUrlFunction: EditUrlFunction = jest.fn(() => hardcodedEditUrl);

    const blogPosts = await getBlogPosts(siteDir, {editUrl: editUrlFunction});

    blogPosts.forEach((blogPost) => {
      expect(blogPost.metadata.editUrl).toEqual(hardcodedEditUrl);
    });

    expect(editUrlFunction).toHaveBeenCalledTimes(6);
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

  test('draft blog post not exists in production build', async () => {
    process.env.NODE_ENV = 'production';
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPosts = await getBlogPosts(siteDir);

    expect(blogPosts.find((v) => v.metadata.title === 'draft')).toBeUndefined();
  });

  test('create blog post without date', async () => {
    const siteDir = path.join(
      __dirname,
      '__fixtures__',
      'website-blog-without-date',
    );
    const blogPosts = await getBlogPosts(siteDir);
    const noDateSource = path.posix.join('@site', PluginPath, 'no date.md');
    const noDateSourceBirthTime = (
      await fs.stat(noDateSource.replace('@site', siteDir))
    ).birthtime;
    const formattedDate = Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(noDateSourceBirthTime);

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
      date: noDateSourceBirthTime,
      formattedDate,
      tags: [],
      prevItem: undefined,
      nextItem: undefined,
      truncated: false,
    });
  });
});
