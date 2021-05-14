/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocFrontMatter, validateDocFrontMatter} from '../docFrontMatter';

describe('validateDocFrontMatter', () => {
  test('accept empty object', () => {
    const frontMatter: DocFrontMatter = {};
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  test('accept valid values', () => {
    const frontMatter: DocFrontMatter = {
      id: 'blog',
      title: 'title',
      description: 'description',
      slug: 'slug',
    };
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  test('accept empty title', () => {
    const frontMatter: DocFrontMatter = {title: ''};
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  // See https://github.com/facebook/docusaurus/issues/4591#issuecomment-822372398
  test('accept empty description', () => {
    const frontMatter: DocFrontMatter = {description: ''};
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  test('accept null custom_edit_url', () => {
    const frontMatter: DocFrontMatter = {custom_edit_url: null};
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });

  // See https://github.com/demisto/content-docs/pull/616#issuecomment-827087566
  test('accept empty custom_edit_url', () => {
    const frontMatter: DocFrontMatter = {custom_edit_url: ''};
    expect(validateDocFrontMatter(frontMatter)).toEqual(frontMatter);
  });
});
