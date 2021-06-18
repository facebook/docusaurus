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
        expect(() => validateBlogPostFrontMatter(frontMatter)).toThrow(message);
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

  testField({
    fieldName: 'description',
    validFrontMatters: [
      // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
      {description: ''},
      {description: 'description'},
    ],
  });

  testField({
    fieldName: 'title',
    validFrontMatters: [
      // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
      {title: ''},
      {title: 'title'},
    ],
  });

  testField({
    fieldName: 'id',
    validFrontMatters: [{id: '123'}, {id: 'id'}],
    invalidFrontMatters: [[{id: ''}, 'is not allowed to be empty']],
  });

  testField({
    fieldName: 'author',
    validFrontMatters: [{author: '123'}, {author: 'author'}],
    invalidFrontMatters: [[{author: ''}, 'is not allowed to be empty']],
  });

  testField({
    fieldName: 'authorTitle',
    validFrontMatters: [{authorTitle: '123'}, {authorTitle: 'authorTitle'}],
    invalidFrontMatters: [[{authorTitle: ''}, 'is not allowed to be empty']],
  });

  testField({
    fieldName: 'author_title',
    validFrontMatters: [{author_title: '123'}, {author_title: 'author_title'}],
    invalidFrontMatters: [[{author_title: ''}, 'is not allowed to be empty']],
  });

  testField({
    fieldName: 'authorURL',
    validFrontMatters: [{authorURL: 'https://docusaurus.io'}],
    invalidFrontMatters: [
      [{authorURL: ''}, 'is not allowed to be empty'],
      [{authorURL: '@site/api/author'}, 'must be a valid uri'],
      [{authorURL: '../../api/author'}, 'must be a valid uri'],
    ],
  });

  testField({
    fieldName: 'author_url',
    validFrontMatters: [{author_url: 'https://docusaurus.io'}],
    invalidFrontMatters: [
      [{author_url: ''}, 'is not allowed to be empty'],
      [{author_url: '@site/api/author'}, 'must be a valid uri'],
      [{author_url: '../../api/author'}, 'must be a valid uri'],
    ],
  });

  testField({
    fieldName: 'authorImageURL',
    validFrontMatters: [
      {authorImageURL: 'https://docusaurus.io/asset/image.png'},
    ],
    invalidFrontMatters: [
      [{authorImageURL: ''}, 'is not allowed to be empty'],
      [{authorImageURL: '@site/api/asset/image.png'}, 'must be a valid uri'],
      [{authorImageURL: '../../api/asset/image.png'}, 'must be a valid uri'],
    ],
  });

  testField({
    fieldName: 'author_image_url',
    validFrontMatters: [
      {author_image_url: 'https://docusaurus.io/asset/image.png'},
    ],
    invalidFrontMatters: [
      [{author_image_url: ''}, 'is not allowed to be empty'],
      [{author_image_url: '@site/api/asset/image.png'}, 'must be a valid uri'],
      [{author_image_url: '../../api/asset/image.png'}, 'must be a valid uri'],
    ],
  });

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
    invalidFrontMatters: [[{slug: ''}, 'is not allowed to be empty']],
  });

  testField({
    fieldName: 'image',
    validFrontMatters: [
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
      [{image: ''}, 'is not allowed to be empty'],
      [{image: 'https://docusaurus.io'}, 'must be a valid relative uri'],
      [
        {image: 'https://docusaurus.io/blog/image.png'},
        'must be a valid relative uri',
      ],
    ],
  });

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
      [{tags: ['']}, 'is not allowed to be empty'],
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
      [{keywords: ['']}, 'is not allowed to be empty'],
      [{keywords: []}, 'does not contain 1 required value(s)'],
    ],
  });

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

  testField({
    fieldName: 'date',
    validFrontMatters: [
      {date: new Date('2020-01-01')},
      // @ts-expect-error: string for test
      {date: '2020-01-01'},
      // @ts-expect-error: string for test
      {date: '2020'},
    ],
    invalidFrontMatters: [
      [{date: 'abc'}, 'must be a valid date'],
      [{date: ''}, 'must be a valid date'],
    ],
  });
});
