/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateDocFrontMatter} from '../docFrontMatter';
import {DocFrontMatter} from '../types';
import escapeStringRegexp from 'escape-string-regexp';

function testField(params: {
  prefix: string;
  validFrontMatters: DocFrontMatter[];
  convertibleFrontMatter?: [
    ConvertableFrontMatter: Record<string, unknown>,
    ConvertedFrontMatter: DocFrontMatter,
  ][];
  invalidFrontMatters?: [
    InvalidFrontMatter: Record<string, unknown>,
    ErrorMessage: string,
  ][];
}) {
  test(`[${params.prefix}] accept valid values`, () => {
    params.validFrontMatters.forEach((frontMatter) => {
      expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
    });
  });

  test(`[${params.prefix}] convert valid values`, () => {
    params.convertibleFrontMatter?.forEach(
      ([convertibleFrontMatter, convertedFrontMatter]) => {
        expect(validateDocFrontMatter(convertibleFrontMatter)).toEqual(
          convertedFrontMatter,
        );
      },
    );
  });

  test(`[${params.prefix}] throw error for values`, () => {
    params.invalidFrontMatters?.forEach(([frontMatter, message]) => {
      try {
        validateDocFrontMatter(frontMatter);
        fail(
          new Error(
            `Doc frontmatter is expected to be rejected, but was accepted successfully:\n ${JSON.stringify(
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
}

describe('validateDocFrontMatter', () => {
  test('accept empty object', () => {
    const frontMatter: DocFrontMatter = {};
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  test('accept unknown field', () => {
    const frontMatter = {abc: '1'};
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });
});

describe('validateDocFrontMatter id', () => {
  testField({
    prefix: 'id',
    validFrontMatters: [{id: '123'}, {id: 'unique_id'}],
    invalidFrontMatters: [[{id: ''}, 'is not allowed to be empty']],
  });
});

describe('validateDocFrontMatter title', () => {
  testField({
    prefix: 'title',
    validFrontMatters: [
      // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
      {title: ''},
      {title: 'title'},
    ],
  });
});

describe('validateDocFrontMatter hide_title', () => {
  testField({
    prefix: 'hide_title',
    validFrontMatters: [{hide_title: true}, {hide_title: false}],
    convertibleFrontMatter: [
      [{hide_title: 'true'}, {hide_title: true}],
      [{hide_title: 'false'}, {hide_title: false}],
    ],
    invalidFrontMatters: [
      [{hide_title: 'yes'}, 'must be a boolean'],
      [{hide_title: 'no'}, 'must be a boolean'],
      [{hide_title: ''}, 'must be a boolean'],
    ],
  });
});

describe('validateDocFrontMatter hide_table_of_contents', () => {
  testField({
    prefix: 'hide_table_of_contents',
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
      [{hide_table_of_contents: ''}, 'must be a boolean'],
    ],
  });
});

describe('validateDocFrontMatter keywords', () => {
  testField({
    prefix: 'keywords',
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
});

describe('validateDocFrontMatter image', () => {
  testField({
    prefix: 'image',
    validFrontMatters: [
      {image: 'https://docusaurus.io/blog/image.png'},
      {image: '/absolute/image.png'},
      {image: '../relative/image.png'},
    ],
    invalidFrontMatters: [
      [{image: ''}, '"image" does not look like a valid url (value=\'\')'],
    ],
  });
});

describe('validateDocFrontMatter description', () => {
  testField({
    prefix: 'description',
    validFrontMatters: [
      // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
      {description: ''},
      {description: 'description'},
    ],
  });
});

describe('validateDocFrontMatter slug', () => {
  testField({
    prefix: 'slug',
    validFrontMatters: [
      {slug: '/'},
      {slug: 'slug'},
      {slug: '/slug/'},
      {slug: './slug'},
      {slug: '../../slug'},
      {slug: '/api/plugins/@docusaurus'},
      {slug: '@site/api/asset'},
      {slug: 'slug1 slug2'},
    ],
    invalidFrontMatters: [[{slug: ''}, 'is not allowed to be empty']],
  });
});

describe('validateDocFrontMatter sidebar_label', () => {
  testField({
    prefix: 'sidebar_label',
    validFrontMatters: [{sidebar_label: 'Awesome docs'}],
    invalidFrontMatters: [[{sidebar_label: ''}, 'is not allowed to be empty']],
  });
});

describe('validateDocFrontMatter sidebar_position', () => {
  testField({
    prefix: 'sidebar_position',
    validFrontMatters: [
      {sidebar_position: -5},
      {sidebar_position: -3.5},
      {sidebar_position: 0},
      {sidebar_position: 5},
      {sidebar_position: 3.5},
    ],
    convertibleFrontMatter: [
      [{sidebar_position: '-1.5'}, {sidebar_position: -1.5}],
      [{sidebar_position: '1'}, {sidebar_position: 1}],
      [{sidebar_position: '1.5'}, {sidebar_position: 1.5}],
    ],
  });
});

describe('validateDocFrontMatter custom_edit_url', () => {
  testField({
    prefix: 'custom_edit_url',
    validFrontMatters: [
      // See https://github.com/demisto/content-docs/pull/616#issuecomment-827087566
      {custom_edit_url: ''},
      {custom_edit_url: null},
      {custom_edit_url: 'https://github.com/facebook/docusaurus/markdown.md'},
      {custom_edit_url: '../../api/docs/markdown.md'},
      {custom_edit_url: '@site/api/docs/markdown.md'},
    ],
  });
});

describe('validateDocFrontMatter parse_number_prefixes', () => {
  testField({
    prefix: 'parse_number_prefixes',
    validFrontMatters: [
      {parse_number_prefixes: true},
      {parse_number_prefixes: false},
    ],
    convertibleFrontMatter: [
      [{parse_number_prefixes: 'true'}, {parse_number_prefixes: true}],
      [{parse_number_prefixes: 'false'}, {parse_number_prefixes: false}],
    ],
    invalidFrontMatters: [
      [{parse_number_prefixes: 'yes'}, 'must be a boolean'],
      [{parse_number_prefixes: 'no'}, 'must be a boolean'],
      [{parse_number_prefixes: ''}, 'must be a boolean'],
    ],
  });
});

describe('validateDocFrontMatter tags', () => {
  testField({
    prefix: 'tags',
    validFrontMatters: [{}, {tags: undefined}, {tags: ['tag1', 'tag2']}],
    convertibleFrontMatter: [[{tags: ['tag1', 42]}, {tags: ['tag1', '42']}]],
    invalidFrontMatters: [
      [{tags: 42}, '"tags" does not look like a valid FrontMatter Yaml array.'],
      [
        {tags: 'tag1, tag2'},
        '"tags" does not look like a valid FrontMatter Yaml array.',
      ],
      [{tags: [{}]}, '"tags[0]" does not look like a valid tag'],
      [{tags: [true]}, '"tags[0]" does not look like a valid tag'],
      [
        {tags: ['tag1', {hey: 'test'}]},
        '"tags[1]" does not look like a valid tag',
      ],
    ],
  });
});

describe('validateDocFrontMatter toc_min_heading_level', () => {
  testField({
    prefix: 'toc_min_heading_level',
    validFrontMatters: [
      {},
      {toc_min_heading_level: undefined},
      {toc_min_heading_level: 2},
      {toc_min_heading_level: 3},
      {toc_min_heading_level: 4},
      {toc_min_heading_level: 5},
      {toc_min_heading_level: 6},
    ],
    convertibleFrontMatter: [
      [{toc_min_heading_level: '2'}, {toc_min_heading_level: 2}],
    ],
    invalidFrontMatters: [
      [
        {toc_min_heading_level: 1},
        '"toc_min_heading_level" must be greater than or equal to 2',
      ],
      [
        {toc_min_heading_level: 7},
        '"toc_min_heading_level" must be less than or equal to 6',
      ],
      [
        {toc_min_heading_level: 'hello'},
        '"toc_min_heading_level" must be a number',
      ],
      [
        {toc_min_heading_level: true},
        '"toc_min_heading_level" must be a number',
      ],
    ],
  });
});

describe('validateDocFrontMatter toc_max_heading_level', () => {
  testField({
    prefix: 'toc_max_heading_level',
    validFrontMatters: [
      {},
      {toc_max_heading_level: undefined},
      {toc_max_heading_level: 2},
      {toc_max_heading_level: 3},
      {toc_max_heading_level: 4},
      {toc_max_heading_level: 5},
      {toc_max_heading_level: 6},
    ],
    convertibleFrontMatter: [
      [{toc_max_heading_level: '2'}, {toc_max_heading_level: 2}],
    ],
    invalidFrontMatters: [
      [
        {toc_max_heading_level: 1},
        '"toc_max_heading_level" must be greater than or equal to 2',
      ],
      [
        {toc_max_heading_level: 7},
        '"toc_max_heading_level" must be less than or equal to 6',
      ],
      [
        {toc_max_heading_level: 'hello'},
        '"toc_max_heading_level" must be a number',
      ],
      [
        {toc_max_heading_level: true},
        '"toc_max_heading_level" must be a number',
      ],
    ],
  });
});

describe('validateDocFrontMatter toc min/max consistency', () => {
  testField({
    prefix: 'toc min/max',
    validFrontMatters: [
      {},
      {toc_min_heading_level: undefined, toc_max_heading_level: undefined},
      {toc_min_heading_level: 2, toc_max_heading_level: 2},
      {toc_min_heading_level: 2, toc_max_heading_level: 6},
      {toc_min_heading_level: 2, toc_max_heading_level: 3},
      {toc_min_heading_level: 3, toc_max_heading_level: 3},
    ],
    invalidFrontMatters: [
      [
        {toc_min_heading_level: 4, toc_max_heading_level: 3},
        '"toc_min_heading_level" must be less than or equal to ref:toc_max_heading_level',
      ],
      [
        {toc_min_heading_level: 6, toc_max_heading_level: 2},
        '"toc_min_heading_level" must be less than or equal to ref:toc_max_heading_level',
      ],
    ],
  });
});
