/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {toTagDocListProp} from '../props';

describe('toTagDocListProp', () => {
  type Params = Parameters<typeof toTagDocListProp>[0];
  type Tag = Params['tag'];
  type Doc = Params['docs'][number];

  const allTagsPath = '/all/tags';

  it('works', () => {
    const tag: Tag = {
      label: 'tag1',
      permalink: '/tag1',
      docIds: ['id1', 'id3'],
    };

    const doc1 = {
      id: 'id1',
      title: 'ZZZ 1',
      description: 'Description 1',
      permalink: '/doc1',
    } as Doc;
    const doc2 = {
      id: 'id2',
      title: 'XXX 2',
      description: 'Description 2',
      permalink: '/doc2',
    } as Doc;
    const doc3 = {
      id: 'id3',
      title: 'AAA 3',
      description: 'Description 3',
      permalink: '/doc3',
    } as Doc;
    const doc4 = {
      id: 'id4',
      title: 'UUU 4',
      description: 'Description 4',
      permalink: '/doc4',
    } as Doc;

    const result = toTagDocListProp({
      allTagsPath,
      tag,
      docs: [doc1, doc2, doc3, doc4],
    });

    expect(result).toEqual({
      allTagsPath,
      count: 2,
      label: tag.label,
      permalink: tag.permalink,
      items: [doc3, doc1], // Docs sorted by title, ignore "id5" absence
    });
  });
});
