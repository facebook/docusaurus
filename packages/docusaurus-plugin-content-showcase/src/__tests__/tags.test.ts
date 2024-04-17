/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fromPartial} from '@total-typescript/shoehorn';
import {getTagsList} from '../tags';

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
};

const invalidTags = {
  opensource: {
    label: 'Open-Source',
    description: {
      message: 'Open-Source Docusaurus sites can be useful for inspiration!',
      id: 'showcase.tag.opensource.description',
    },
    color: '#39c',
  },
};

describe('showcase tags', () => {
  it('get tag list', async () => {
    const {tagKeys} = await getTagsList({
      configTags: fromPartial(tags),
      configPath: '',
    });
    expect(tagKeys).toEqual(Object.keys(tags));
  });

  it('get tag list from file', async () => {
    const {tagKeys} = await getTagsList({
      configTags: './__fixtures__/tags.yml',
      configPath: __dirname,
    });
    expect(tagKeys).toEqual(Object.keys(tags));
  });

  it('error get tag list', async () => {
    const tagList = getTagsList({
      configTags: fromPartial(invalidTags),
      configPath: '',
    });

    await expect(() => tagList).rejects.toThrowErrorMatchingInlineSnapshot(
      `"There was an error extracting tags: Color must be a hexadecimal color string (e.g., #14cfc3 #E9669E)"`,
    );
  });
});
