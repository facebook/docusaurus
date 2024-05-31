/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fromPartial} from '@total-typescript/shoehorn';
import {createShowcaseItemSchema, validateShowcaseItem} from '../validation';
import {getTagsList} from '../tags';
import type {ShowcaseItem} from '@docusaurus/plugin-content-showcase';

const tags = {
  favorite: {
    label: 'Favorite',
    description: {
      message:
        'Our favorite Docusaurus sites that you must absolutely check out!',
      id: 'showcase.tag.favorite.description',
    },
    color: '#e9669e',
  },
  opensource: {
    label: 'Open-Source',
    description: {
      message: 'Open-Source Docusaurus sites can be useful for inspiration!',
      id: 'showcase.tag.opensource.description',
    },
    color: '#39ca30',
  },
};

async function prepareSchema() {
  const {tagKeys} = await getTagsList({
    configTags: fromPartial(tags),
    configPath: '',
  });
  return createShowcaseItemSchema(tagKeys);
}

describe('showcase item schema', () => {
  it('accepts valid item', async () => {
    const item: ShowcaseItem = {
      title: 'title',
      description: 'description',
      preview: 'preview',
      source: 'source',
      tags: [],
      website: 'website',
    };
    const showcaseItemSchema = await prepareSchema();
    expect(validateShowcaseItem({item, showcaseItemSchema})).toEqual(item);
  });
  it('reject invalid tags', async () => {
    const item: ShowcaseItem = {
      title: 'title',
      description: 'description',
      preview: 'preview',
      source: 'source',
      // @ts-expect-error: invalid tag
      tags: ['invalid'],
      website: 'website',
    };
    const showcaseItemSchema = await prepareSchema();
    expect(() =>
      validateShowcaseItem({item, showcaseItemSchema}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""tags[0]" must be one of [favorite, opensource]"`,
    );
  });
  it('reject invalid item', async () => {
    const item: ShowcaseItem = fromPartial({});
    const showcaseItemSchema = await prepareSchema();
    expect(() =>
      validateShowcaseItem({item, showcaseItemSchema}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""title" is required. "description" is required. "preview" is required. "website" is required. "source" is required"`,
    );
  });
  it('reject invalid item value', async () => {
    // @ts-expect-error: title should be a string
    const item: ShowcaseItem = fromPartial({title: 42});
    const showcaseItemSchema = await prepareSchema();

    expect(() =>
      validateShowcaseItem({item, showcaseItemSchema}),
    ).toThrowErrorMatchingInlineSnapshot(
      `""title" must be a string. "description" is required. "preview" is required. "website" is required. "source" is required"`,
    );
  });
});
