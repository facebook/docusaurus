/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
    // todo throw an error with `getTagsList tagSchema`
    color: '#39c',
  },
};

describe('showcase tags', () => {
  it('get tag list', async () => {
    const tagList = await getTagsList({
      configTags: tags,
      configPath: '',
    });
    expect(tagList).toEqual(Object.keys(tags));
  });

  it('get tag list from file', async () => {
    const tagList = await getTagsList({
      configTags: './__fixtures__/tags.yml',
      configPath: __dirname,
    });
    expect(tagList).toEqual(Object.keys(tags));
  });

  it('error get tag list', async () => {
    const tagList = getTagsList({
      configTags: invalidTags,
      configPath: '',
    });

    await expect(() => tagList).rejects.toThrowErrorMatchingInlineSnapshot(
      `"There was an error extracting tags: Color must be a hexadecimal color string (e.g., #RRGGBB #rrggbb)"`,
    );
  });
});
