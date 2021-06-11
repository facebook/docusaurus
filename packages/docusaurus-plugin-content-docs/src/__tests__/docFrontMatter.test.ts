/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocFrontMatter, validateDocFrontMatter} from '../docFrontMatter';

function testField(params: {
  fieldName: keyof DocFrontMatter;
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
  describe(`"${params.fieldName}" field`, () => {
    test('accept valid values', () => {
      params.validFrontMatters.forEach((frontMatter) => {
        expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
      });
    });

    test('convert valid values', () => {
      params.convertibleFrontMatter?.forEach(
        ([convertibleFrontMatter, convertedFrontMatter]) => {
          expect(validateDocFrontMatter(convertibleFrontMatter)).toEqual(
            convertedFrontMatter,
          );
        },
      );
    });

    test('throw error for values', () => {
      params.invalidFrontMatters?.forEach(([frontMatter, message]) => {
        expect(() => validateDocFrontMatter(frontMatter)).toThrow(message);
      });
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

  testField({
    fieldName: 'id',
    validFrontMatters: [{id: '123'}, {id: 'unique_id'}],
    invalidFrontMatters: [[{id: ''}, 'is not allowed to be empty']],
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
    fieldName: 'hide_title',
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
      [{hide_table_of_contents: ''}, 'must be a boolean'],
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
    fieldName: 'image',
    validFrontMatters: [{image: 'https://docusaurus.io/blog/image.png'}],
    invalidFrontMatters: [
      [{image: ''}, 'is not allowed to be empty'],
      [{image: './api/@docusaurus/plugin-debug'}, 'must be a valid uri'],
      [{image: '/api/@docusaurus/plugin-debug'}, 'must be a valid uri'],
      [{image: '@site/api/asset/image.png'}, 'must be a valid uri'],
    ],
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
    fieldName: 'slug',
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

  testField({
    fieldName: 'sidebar_label',
    validFrontMatters: [{sidebar_label: 'Awesome docs'}],
    invalidFrontMatters: [[{sidebar_label: ''}, 'is not allowed to be empty']],
  });

  testField({
    fieldName: 'sidebar_position',
    validFrontMatters: [
      {sidebar_position: 0},
      {sidebar_position: 5},
      {sidebar_position: 3.5},
    ],
    convertibleFrontMatter: [
      [{sidebar_position: '1'}, {sidebar_position: 1}],
      [{sidebar_position: '1.5'}, {sidebar_position: 1.5}],
    ],
    invalidFrontMatters: [
      [{sidebar_position: -1}, 'must be greater than or equal to 0'],
    ],
  });

  testField({
    fieldName: 'custom_edit_url',
    validFrontMatters: [
      // See https://github.com/demisto/content-docs/pull/616#issuecomment-827087566
      {custom_edit_url: ''},
      {custom_edit_url: null},
      {custom_edit_url: 'https://github.com/facebook/docusaurus/markdown.md'},
      {custom_edit_url: '../../api/docs/markdown.md'},
      {custom_edit_url: '@site/api/docs/markdown.md'},
    ],
  });

  testField({
    fieldName: 'parse_number_prefixes',
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
