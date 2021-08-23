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
import escapeStringRegexp from 'escape-string-regexp';

function testField(params: {
  fieldName: keyof BlogPostFrontMatter;
  validFrontMatters: BlogPostFrontMatter[];
  convertibleFrontMatter?: [
    ConvertableFrontMatter: Record<string, unknown>,
    ConvertedFrontMatter: BlogPostFrontMatter,
  ][];
  invalidFrontMatters?: [
    InvalidFrontMatter: Record<string, unknown>,
    ErrorMessage: string,
  ][];
}) {
  describe(`"${params.fieldName}" field`, () => {
    test('accept valid values', () => {
      params.validFrontMatters.forEach((frontMatter) => {
        expect(validateBlogPostFrontMatter(frontMatter)).toEqual(frontMatter);
      });
    });

    test('convert valid values', () => {
      params.convertibleFrontMatter?.forEach(
        ([convertibleFrontMatter, convertedFrontMatter]) => {
          expect(validateBlogPostFrontMatter(convertibleFrontMatter)).toEqual(
            convertedFrontMatter,
          );
        },
      );
    });

    test('throw error for values', () => {
      params.invalidFrontMatters?.forEach(([frontMatter, message]) => {
        try {
          validateBlogPostFrontMatter(frontMatter);
          fail(
            new Error(
              `Blog frontmatter is expected to be rejected, but was accepted successfully:\n ${JSON.stringify(
                frontMatter,
                null,
                2,
              )}`,
            ),
          );
        } catch (e) {
          expect(e.message).toMatch(new RegExp(escapeStringRegexp(message)));
        }
      });
    });
  });
}

describe('validateBlogPostFrontMatter', () => {
  test('accept empty object', () => {
    const frontMatter = {};
    expect(validateBlogPostFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  test('accept unknown field', () => {
    const frontMatter = {abc: '1'};
    expect(validateBlogPostFrontMatter(frontMatter)).toEqual(frontMatter);
  });
});

describe('validateBlogPostFrontMatter description', () => {
  testField({
    fieldName: 'description',
    validFrontMatters: [
      // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
      {description: ''},
      {description: 'description'},
    ],
  });
});

describe('validateBlogPostFrontMatter title', () => {
  testField({
    fieldName: 'title',
    validFrontMatters: [
      // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
      {title: ''},
      {title: 'title'},
    ],
  });
});

describe('validateBlogPostFrontMatter id', () => {
  testField({
    fieldName: 'id',
    validFrontMatters: [{id: '123'}, {id: 'id'}],
    invalidFrontMatters: [[{id: ''}, 'not allowed to be empty']],
  });
});

describe('validateBlogPostFrontMatter author', () => {
  testField({
    fieldName: 'author',
    validFrontMatters: [{author: '123'}, {author: 'author'}],
    invalidFrontMatters: [[{author: ''}, 'not allowed to be empty']],
  });
});

describe('validateBlogPostFrontMatter author_title', () => {
  testField({
    fieldName: 'author_title',
    validFrontMatters: [
      {author: '123', author_title: '123'},
      {author: '123', author_title: 'author_title'},
    ],
    invalidFrontMatters: [[{author_title: ''}, 'not allowed to be empty']],
  });

  testField({
    fieldName: 'authorTitle',
    validFrontMatters: [{authorTitle: '123'}, {authorTitle: 'authorTitle'}],
    invalidFrontMatters: [[{authorTitle: ''}, 'not allowed to be empty']],
  });
});

describe('validateBlogPostFrontMatter author_url', () => {
  testField({
    fieldName: 'author_url',
    validFrontMatters: [
      {author_url: 'https://docusaurus.io'},
      {author_url: '../../relative'},
      {author_url: '/absolute'},
    ],
    invalidFrontMatters: [[{author_url: ''}, 'not allowed to be empty']],
  });

  testField({
    fieldName: 'authorURL',
    validFrontMatters: [
      {authorURL: 'https://docusaurus.io'},
      {authorURL: '../../relative'},
      {authorURL: '/absolute'},
    ],

    invalidFrontMatters: [[{authorURL: ''}, 'not allowed to be empty']],
  });
});

describe('validateBlogPostFrontMatter author_image_url', () => {
  testField({
    fieldName: 'author_image_url',
    validFrontMatters: [
      {author_image_url: 'https://docusaurus.io/asset/image.png'},
      {author_image_url: '../../relative'},
      {author_image_url: '/absolute'},
    ],
    invalidFrontMatters: [[{author_image_url: ''}, 'not allowed to be empty']],
  });

  testField({
    fieldName: 'authorImageURL',
    validFrontMatters: [
      {authorImageURL: 'https://docusaurus.io/asset/image.png'},
      {authorImageURL: '../../relative'},
      {authorImageURL: '/absolute'},
    ],
    invalidFrontMatters: [[{authorImageURL: ''}, 'not allowed to be empty']],
  });
});

describe('validateBlogPostFrontMatter author_image_url', () => {
  testField({
    fieldName: 'author_image_url',
    validFrontMatters: [
      {author_image_url: 'https://docusaurus.io/asset/image.png'},
      {author_image_url: '../../relative'},
      {author_image_url: '/absolute'},
    ],
    invalidFrontMatters: [[{author_image_url: ''}, 'not allowed to be empty']],
  });

  testField({
    fieldName: 'authorImageURL',
    validFrontMatters: [
      {authorImageURL: 'https://docusaurus.io/asset/image.png'},
      {authorImageURL: '../../relative'},
      {authorImageURL: '/absolute'},
    ],
    invalidFrontMatters: [[{authorImageURL: ''}, 'not allowed to be empty']],
  });
});

describe('validateBlogPostFrontMatter author object', () => {
  testField({
    fieldName: 'author',
    validFrontMatters: [
      {author: {name: '123'}},
      {author: {title: '123'}},
      {author_key: '123', author: {title: '123'}},
    ],
    invalidFrontMatters: [
      [
        {author: '123', author_keys: ['123']},
        "doesn't match any of the accepted formats",
      ],
    ],
  });
});

describe('validateBlogPostFrontMatter slug', () => {
  testField({
    fieldName: 'slug',
    validFrontMatters: [
      {slug: 'blog/'},
      {slug: '/blog'},
      {slug: '/blog/'},
      {slug: './blog'},
      {slug: '../blog'},
      {slug: '../../blog'},
      {slug: '/api/plugins/@docusaurus/plugin-debug'},
      {slug: '@site/api/asset/image.png'},
    ],
    invalidFrontMatters: [[{slug: ''}, 'not allowed to be empty']],
  });
});

describe('validateBlogPostFrontMatter image', () => {
  testField({
    fieldName: 'image',
    validFrontMatters: [
      {image: 'https://docusaurus.io/image.png'},
      {image: 'blog/'},
      {image: '/blog'},
      {image: '/blog/'},
      {image: './blog'},
      {image: '../blog'},
      {image: '../../blog'},
      {image: '/api/plugins/@docusaurus/plugin-debug'},
      {image: '@site/api/asset/image.png'},
    ],
    invalidFrontMatters: [
      [{image: ''}, '"image" does not match any of the allowed types'],
    ],
  });
});

describe('validateBlogPostFrontMatter tags', () => {
  testField({
    fieldName: 'tags',
    validFrontMatters: [
      {tags: []},
      {tags: ['hello']},
      {tags: ['hello', 'world']},
      {tags: ['hello', 'world']},
      {tags: ['hello', {label: 'tagLabel', permalink: '/tagPermalink'}]},
    ],
    invalidFrontMatters: [
      [{tags: ''}, 'must be an array'],
      [{tags: ['']}, 'not allowed to be empty'],
    ],
    // See https://github.com/facebook/docusaurus/issues/4642
    convertibleFrontMatter: [
      [{tags: [42]}, {tags: ['42']}],
      [
        {tags: [{label: 84, permalink: '/tagPermalink'}]},
        {tags: [{label: '84', permalink: '/tagPermalink'}]},
      ],
    ],
  });
});

describe('validateBlogPostFrontMatter keywords', () => {
  testField({
    fieldName: 'keywords',
    validFrontMatters: [
      {keywords: ['hello']},
      {keywords: ['hello', 'world']},
      {keywords: ['hello', 'world']},
      {keywords: ['hello']},
    ],
    invalidFrontMatters: [
      [{keywords: ''}, 'must be an array'],
      [{keywords: ['']}, 'not allowed to be empty'],
      [{keywords: []}, 'does not contain 1 required value(s)'],
    ],
  });
});

describe('validateBlogPostFrontMatter draft', () => {
  testField({
    fieldName: 'draft',
    validFrontMatters: [{draft: true}, {draft: false}],
    convertibleFrontMatter: [
      [{draft: 'true'}, {draft: true}],
      [{draft: 'false'}, {draft: false}],
    ],
    invalidFrontMatters: [
      [{draft: 'yes'}, 'must be a boolean'],
      [{draft: 'no'}, 'must be a boolean'],
    ],
  });
});

describe('validateBlogPostFrontMatter hide_table_of_contents', () => {
  testField({
    fieldName: 'hide_table_of_contents',
    validFrontMatters: [
      {hide_table_of_contents: true},
      {hide_table_of_contents: false},
    ],
    convertibleFrontMatter: [
      [{hide_table_of_contents: 'true'}, {hide_table_of_contents: true}],
      [{hide_table_of_contents: 'false'}, {hide_table_of_contents: false}],
    ],
    invalidFrontMatters: [
      [{hide_table_of_contents: 'yes'}, 'must be a boolean'],
      [{hide_table_of_contents: 'no'}, 'must be a boolean'],
    ],
  });
});

describe('validateBlogPostFrontMatter date', () => {
  testField({
    fieldName: 'date',
    validFrontMatters: [
      {date: new Date('2020-01-01')},
      {date: '2020-01-01'},
      {date: '2020'},
    ],
    invalidFrontMatters: [
      [{date: 'abc'}, 'must be a valid date'],
      [{date: ''}, 'must be a valid date'],
    ],
  });
});
