/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {BlogPost, BlogContent, PluginOptions} from '../types';
import {getTranslationFiles, translateContent} from '../translations';
import {DEFAULT_OPTIONS} from '../pluginOptionSchema';
import {updateTranslationFileMessages} from '@docusaurus/utils';

const sampleBlogOptions: PluginOptions = {
  ...DEFAULT_OPTIONS,
  blogSidebarTitle: 'All my posts',
  blogTitle: 'My blog',
  blogDescription: "Someone's random blog",
};

const sampleBlogPosts: BlogPost[] = [
  {
    id: 'hello',
    metadata: {
      permalink: '/blog/2021/06/19/hello',
      source: '/blog/2021/06/19/hello',
      description: '/blog/2021/06/19/hello',
      date: new Date(2021, 6, 19),
      formattedDate: 'June 19, 2021',
      tags: [],
      title: 'Hello',
      truncated: true,
    },
  },
];

const sampleBlogContent: BlogContent = {
  blogSidebarTitle: sampleBlogOptions.blogSidebarTitle,
  blogListPaginated: [
    {
      items: ['hello'],
      metadata: {
        permalink: '/',
        page: 1,
        postsPerPage: 10,
        totalPages: 1,
        totalCount: 1,
        previousPage: null,
        nextPage: null,
        blogTitle: sampleBlogOptions.blogTitle,
        blogDescription: sampleBlogOptions.blogDescription,
      },
    },
  ],
  blogPosts: sampleBlogPosts,
  blogTags: {},
  blogTagsListPath: '/tags',
};

function getSampleTranslationFiles() {
  return getTranslationFiles(sampleBlogOptions);
}
function getSampleTranslationFilesTranslated() {
  const translationFiles = getSampleTranslationFiles();
  return translationFiles.map((translationFile) =>
    updateTranslationFileMessages(
      translationFile,
      (message) => `${message} (translated)`,
    ),
  );
}

describe('getContentTranslationFiles', () => {
  test('should return translation files matching snapshot', async () => {
    expect(getSampleTranslationFiles()).toMatchSnapshot();
  });
});

describe('translateContent', () => {
  test('should not translate anything if translation files are untranslated', () => {
    const translationFiles = getSampleTranslationFiles();
    expect(translateContent(sampleBlogContent, translationFiles)).toEqual(
      sampleBlogContent,
    );
  });

  test('should return translated loaded content matching snapshot', () => {
    const translationFiles = getSampleTranslationFilesTranslated();
    expect(
      translateContent(sampleBlogContent, translationFiles),
    ).toMatchSnapshot();
  });
});
