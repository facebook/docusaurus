/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import pluginContentBlog from '../index';
import {DocusaurusConfig, LoadContext} from '@docusaurus/types';

describe('loadBlog', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'website');
  const pluginPath = 'blog';
  const getBlogPosts = async () => {
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
      } as LoadContext,
      {
        path: pluginPath,
        editUrl:
          'https://github.com/facebook/docusaurus/edit/master/website-1x',
      },
    );
    const {blogPosts} = await plugin.loadContent();

    return blogPosts;
  };

  test('simple website', async () => {
    const blogPosts = await getBlogPosts();
    const noDateSource = path.join('@site', pluginPath, 'no date.md');
    const noDateSourceBirthTime = (
      await fs.stat(noDateSource.replace('@site', siteDir))
    ).birthtime;
    const noDatePermalink = `/blog/${noDateSourceBirthTime
      .toISOString()
      .substr(0, '2019-01-01'.length)
      .replace(/-/g, '/')}/no date`;

    expect({
      ...blogPosts.find(v => v.metadata.title === 'date-matter').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      permalink: '/blog/2019/01/01/date-matter',
      readingTime: 0.02,
      source: path.join('@site', pluginPath, 'date-matter.md'),
      title: 'date-matter',
      description: `date inside front matter`,
      date: new Date('2019-01-01'),
      tags: [],
      nextItem: {
        permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
        title: 'Happy 1st Birthday Slash!',
      },
      truncated: false,
    });

    expect(
      blogPosts.find(v => v.metadata.title === 'Happy 1st Birthday Slash!')
        .metadata,
    ).toEqual({
      permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
      readingTime: 0.01,
      source: path.join(
        '@site',
        pluginPath,
        '2018-12-14-Happy-First-Birthday-Slash.md',
      ),
      title: 'Happy 1st Birthday Slash!',
      description: `pattern name`,
      date: new Date('2018-12-14'),
      tags: [],
      prevItem: {
        permalink: '/blog/2019/01/01/date-matter',
        title: 'date-matter',
      },
      truncated: false,
    });

    expect({
      ...blogPosts.find(v => v.metadata.title === 'no date').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      permalink: noDatePermalink,
      readingTime: 0.01,
      source: noDateSource,
      title: 'no date',
      description: `no date`,
      date: noDateSourceBirthTime,
      tags: [],
      nextItem: {
        permalink: '/blog/2020/02/27/draft',
        title: 'draft',
      },
      truncated: false,
    });
  });

  test('blog with editUrl', async () => {
    const blogPosts = await getBlogPosts();

    expect({
      ...blogPosts.find(v => v.metadata.title === 'date-matter').metadata,
      ...{prevItem: undefined},
    }).toEqual({
      editBlogUrl:
        'https://github.com/facebook/docusaurus/edit/master/website-1x/blog/date-matter',
      permalink: '/blog/2019/01/01/date-matter',
      source: path.join('@site', pluginPath, 'date-matter.md'),
      title: 'date-matter',
      description: `date inside front matter`,
      date: new Date('2019-01-01'),
      tags: [],
      prevItem: undefined,
      nextItem: {
        permalink: '/blog/2018/12/14/Happy-First-Birthday-Slash',
        title: 'Happy 1st Birthday Slash!',
      },
      truncated: false,
    });
  });

  test('draft blog post not exists in production build', async () => {
    process.env.NODE_ENV = 'production';
    const blogPosts = await getBlogPosts();

    expect(blogPosts.find(v => v.metadata.title === 'draft')).toBeUndefined();
  });
});
