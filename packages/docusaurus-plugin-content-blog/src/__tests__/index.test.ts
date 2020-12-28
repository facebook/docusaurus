/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import pluginContentBlog from '../index';
import {DocusaurusConfig, LoadContext, I18n} from '@docusaurus/types';
import {PluginOptionSchema} from '../pluginOptionSchema';

const DefaultI18N: I18n = {
  currentLocale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
};

function validateAndNormalize(schema, options) {
  const {value, error} = schema.validate(options);
  if (error) {
    throw error;
  } else {
    return value;
  }
}

describe('loadBlog', () => {
  const pluginPath = 'blog';
  const getBlogPosts = async (siteDir) => {
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
        i18n: DefaultI18N,
      } as LoadContext,
      validateAndNormalize(PluginOptionSchema, {
        path: pluginPath,
        editUrl:
          'https://github.com/facebook/docusaurus/edit/master/website-1x',
      }),
    );
    const {blogPosts} = await plugin.loadContent();

    return blogPosts;
  };

  test('simple website', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const blogPosts = await getBlogPosts(siteDir);

    expect({
      ...blogPosts.find((v) => v.metadata.title === 'date-matter').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website-1x/blog/date-matter.md',
      permalink: '/blog/date-matter',
      readingTime: 0.02,
      source: path.join('@site', pluginPath, 'date-matter.md'),
      title: 'date-matter',
      description: `date inside front matter`,
      date: new Date('2019-01-01'),
      prevItem: undefined,
      tags: [],
      nextItem: {
        permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
        title: 'Happy 1st Birthday Slash! (translated)',
      },
      truncated: false,
    });

    expect(
      blogPosts.find(
        (v) => v.metadata.title === 'Happy 1st Birthday Slash! (translated)',
      ).metadata,
    ).toEqual({
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website-1x/i18n/en/docusaurus-plugin-content-blog/2018-12-14-Happy-First-Birthday-Slash.md',
      permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
      readingTime: 0.015,
      source: path.join(
        '@site',
        // pluginPath,
        path.join('i18n', 'en', 'docusaurus-plugin-content-blog'),
        '2018-12-14-Happy-First-Birthday-Slash.md',
      ),
      title: 'Happy 1st Birthday Slash! (translated)',
      description: `Happy birthday! (translated)`,
      date: new Date('2018-12-14'),
      tags: [],
      prevItem: {
        permalink: '/blog/date-matter',
        title: 'date-matter',
      },
      truncated: false,
    });

    expect({
      ...blogPosts.find((v) => v.metadata.title === 'Complex Slug').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website-1x/blog/complex-slug.md',
      permalink: '/blog/hey/my super path/héllô',
      readingTime: 0.015,
      source: path.join('@site', pluginPath, 'complex-slug.md'),
      title: 'Complex Slug',
      description: `complex url slug`,
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/simple/slug',
        title: 'Simple Slug',
      },
      date: new Date('2020-08-16'),
      tags: [],
      truncated: false,
    });

    expect({
      ...blogPosts.find((v) => v.metadata.title === 'Simple Slug').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website-1x/blog/simple-slug.md',
      permalink: '/blog/simple/slug',
      readingTime: 0.015,
      source: path.join('@site', pluginPath, 'simple-slug.md'),
      title: 'Simple Slug',
      description: `simple url slug`,
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/draft',
        title: 'draft',
      },
      date: new Date('2020-08-15'),
      tags: [],
      truncated: false,
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
    const noDateSource = path.join('@site', pluginPath, 'no date.md');
    const noDateSourceBirthTime = (
      await fs.stat(noDateSource.replace('@site', siteDir))
    ).birthtime;

    expect({
      ...blogPosts.find((v) => v.metadata.title === 'no date').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website-1x/blog/no date.md',
      permalink: '/blog/no date',
      readingTime: 0.01,
      source: noDateSource,
      title: 'no date',
      description: `no date`,
      date: noDateSourceBirthTime,
      tags: [],
      prevItem: undefined,
      nextItem: undefined,
      truncated: false,
    });
  });
});
