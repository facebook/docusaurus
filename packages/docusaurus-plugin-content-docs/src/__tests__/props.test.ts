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

  test('should work', () => {
    const tag: Tag = {
      name: 'tag1',
      permalink: '/tag1',
      docIds: ['id1', 'id3'],
    };

    const doc1: Doc = {
      id: 'id1',
      title: 'ZZZ 1',
      description: 'Description 1',
      permalink: '/doc1',
    };
    const doc2: Doc = {
      id: 'id2',
      title: 'XXX 2',
      description: 'Description 2',
      permalink: '/doc2',
    };
    const doc3: Doc = {
      id: 'id3',
      title: 'AAA 3',
      description: 'Description 3',
      permalink: '/doc3',
    };
    const doc4: Doc = {
      id: 'id4',
      title: 'UUU 4',
      description: 'Description 4',
      permalink: '/doc4',
    };

    const result = toTagDocListProp({
      allTagsPath,
      tag,
      docs: [doc1, doc2, doc3, doc4],
    });

    expect(result).toEqual({
      allTagsPath,
      name: tag.name,
      permalink: tag.permalink,
      docs: [doc3, doc1], // docs sorted by title, ignore "id5" absence
    });
  });
});
