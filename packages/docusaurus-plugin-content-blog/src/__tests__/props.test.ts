/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {toTagsProp} from '../props';

describe('toTagsProp', () => {
  type Tags = Parameters<typeof toTagsProp>[0]['blogTags'];
  type Tag = Tags[number];

  const tag1: Tag = {
    label: 'Tag 1',
    permalink: '/tag1',
    items: ['item1', 'item2'],
    pages: [],
    unlisted: false,
  };

  const tag2: Tag = {
    label: 'Tag 2',
    permalink: '/tag2',
    items: ['item3'],
    pages: [],
    unlisted: false,
  };

  function testTags(...tags: Tag[]) {
    const blogTags: Tags = {};
    tags.forEach((tag) => {
      blogTags[tag.permalink] = tag;
    });
    return toTagsProp({blogTags});
  }

  it('works', () => {
    expect(testTags(tag1, tag2)).toEqual([
      {
        count: tag1.items.length,
        label: tag1.label,
        permalink: tag1.permalink,
      },
      {
        count: tag2.items.length,
        label: tag2.label,
        permalink: tag2.permalink,
      },
    ]);
  });

  it('filters unlisted tags', () => {
    expect(testTags(tag1, {...tag2, unlisted: true})).toEqual([
      {
        count: tag1.items.length,
        label: tag1.label,
        permalink: tag1.permalink,
      },
    ]);

    expect(testTags({...tag1, unlisted: true}, tag2)).toEqual([
      {
        count: tag2.items.length,
        label: tag2.label,
        permalink: tag2.permalink,
      },
    ]);
  });
});
