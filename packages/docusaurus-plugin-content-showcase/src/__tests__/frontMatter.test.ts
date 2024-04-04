/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateShowcaseItem} from '../validation';
import type {ShowcaseItem} from '@docusaurus/plugin-content-showcase';

describe('showcase front matter schema', () => {
  it('accepts valid frontmatter', () => {
    const frontMatter: ShowcaseItem = {
      title: 'title',
      description: 'description',
      preview: 'preview',
      source: 'source',
      tags: [],
      website: 'website',
    };
    expect(validateShowcaseItem(frontMatter)).toEqual(frontMatter);
  });

  it('reject invalid frontmatter', () => {
    const frontMatter = {};
    expect(() =>
      validateShowcaseItem(frontMatter),
    ).toThrowErrorMatchingInlineSnapshot(
      `""title" is required. "description" is required. "preview" is required. "website" is required. "source" is required. "tags" is required"`,
    );
  });

  it('reject invalid frontmatter value', () => {
    const frontMatter = {title: 42};
    expect(() =>
      validateShowcaseItem(frontMatter),
    ).toThrowErrorMatchingInlineSnapshot(
      `""title" must be a string. "description" is required. "preview" is required. "website" is required. "source" is required. "tags" is required"`,
    );
  });
});
