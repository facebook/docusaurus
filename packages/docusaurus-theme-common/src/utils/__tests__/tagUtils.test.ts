/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {listTagsByLetters} from '../tagsUtils';

describe('listTagsByLetters', () => {
  type Param = Parameters<typeof listTagsByLetters>[0];
  type Tag = Param[number];
  type Result = ReturnType<typeof listTagsByLetters>;

  it('creates letters list', () => {
    const tag1: Tag = {
      label: 'tag1',
      permalink: '/tag1',
      count: 1,
    };
    const tag2: Tag = {
      label: 'Tag2',
      permalink: '/tag2',
      count: 11,
    };
    const tagZxy: Tag = {
      label: 'zxy',
      permalink: '/zxy',
      count: 987,
    };
    const tagAbc: Tag = {
      label: 'Abc',
      permalink: '/abc',
      count: 123,
    };
    const tagDef: Tag = {
      label: 'def',
      permalink: '/def',
      count: 1,
    };
    const tagAaa: Tag = {
      label: 'aaa',
      permalink: '/aaa',
      count: 10,
    };

    const expectedResult: Result = [
      {letter: 'A', tags: [tagAaa, tagAbc]},
      {letter: 'D', tags: [tagDef]},
      {letter: 'T', tags: [tag1, tag2]},
      {letter: 'Z', tags: [tagZxy]},
    ];

    // Input order shouldn't matter, output is always consistently sorted
    expect(
      listTagsByLetters([tag1, tag2, tagZxy, tagAbc, tagDef, tagAaa]),
    ).toEqual(expectedResult);
    expect(
      listTagsByLetters([tagZxy, tagDef, tagAaa, tag2, tagAbc, tag1]),
    ).toEqual(expectedResult);
    expect(
      listTagsByLetters(
        _.shuffle([tagZxy, tagDef, tagAaa, tag2, tagAbc, tag1]),
      ),
    ).toEqual(expectedResult);
  });
});
