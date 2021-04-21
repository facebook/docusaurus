/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  BlogPostFrontMatter,
  validateBlogPostFrontMatter,
} from '../blogFrontMatter';

describe('validateBlogPostFrontMatter', () => {
  test('accept empty object', () => {
    const frontMatter = {};
    expect(validateBlogPostFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  test('accept valid values', () => {
    const frontMatter: BlogPostFrontMatter = {
      id: 'blog',
      title: 'title',
      description: 'description',
      date: 'date',
      slug: 'slug',
      draft: true,
      tags: ['hello', {label: 'tagLabel', permalink: '/tagPermalink'}],
    };
    expect(validateBlogPostFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  test('accept empty title', () => {
    const frontMatter: BlogPostFrontMatter = {title: ''};
    expect(validateBlogPostFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  test('accept empty description', () => {
    const frontMatter: BlogPostFrontMatter = {description: ''};
    expect(validateBlogPostFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  // See https://github.com/facebook/docusaurus/issues/4642
  test('convert tags as numbers', () => {
    const frontMatter: BlogPostFrontMatter = {
      tags: [
        // @ts-expect-error: number for test
        42,
        {
          // @ts-expect-error: number for test
          label: 84,
          permalink: '/tagPermalink',
        },
      ],
    };
    expect(validateBlogPostFrontMatter(frontMatter)).toEqual({
      tags: [
        '42',
        {
          label: '84',
          permalink: '/tagPermalink',
        },
      ],
    });
  });
});
