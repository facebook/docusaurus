/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateShowcaseItem} from '../validation';
import type {ShowcaseItem} from '@docusaurus/plugin-content-showcase';

// todo broken
describe('showcase front matter schema', () => {
  it('accepts valid frontmatter', () => {
    const item: ShowcaseItem = {
      title: 'title',
      description: 'description',
      preview: 'preview',
      source: 'source',
      tags: [],
      website: 'website',
    };
    expect(validateShowcaseItem({items: item, tagsSchema, tags})).toEqual(item);
  });
  it('reject invalid frontmatter', () => {
    const frontMatter = {};
    expect(() =>
      validateShowcaseItem(frontMatter),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Cannot read properties of undefined (reading 'validate')"`,
    );
  });
  it('reject invalid frontmatter value', () => {
    const frontMatter = {title: 42};
    expect(() =>
      validateShowcaseItem(frontMatter),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Cannot read properties of undefined (reading 'validate')"`,
    );
  });
});
