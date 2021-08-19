/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {shuffle} from 'lodash';
import {listTagsByLetters} from '../tagsUtils';

describe('listTagsByLetters', () => {
  type Param = Parameters<typeof listTagsByLetters>[0];
  type Tag = Param[number];
  type Result = ReturnType<typeof listTagsByLetters>;

  test('Should create letters list', () => {
    const tag1: Tag = {
      name: 'tag1',
      permalink: '/tag1',
      count: 1,
    };
    const tag2: Tag = {
      name: 'Tag2',
      permalink: '/tag2',
      count: 11,
    };
    const tagzxy: Tag = {
      name: 'zxy',
      permalink: '/zxy',
      count: 987,
    };
    const tagAbc: Tag = {
      name: 'Abc',
      permalink: '/abc',
      count: 123,
    };
    const tagdef: Tag = {
      name: 'def',
      permalink: '/def',
      count: 1,
    };
    const tagaaa: Tag = {
      name: 'aaa',
      permalink: '/aaa',
      count: 10,
    };

    const expectedResult: Result = [
      {letter: 'A', tags: [tagaaa, tagAbc]},
      {letter: 'D', tags: [tagdef]},
      {letter: 'T', tags: [tag1, tag2]},
      {letter: 'Z', tags: [tagzxy]},
    ];

    // Input order shouldn't matter, output is always consistently sorted
    expect(
      listTagsByLetters([tag1, tag2, tagzxy, tagAbc, tagdef, tagaaa]),
    ).toEqual(expectedResult);
    expect(
      listTagsByLetters([tagzxy, tagdef, tagaaa, tag2, tagAbc, tag1]),
    ).toEqual(expectedResult);
    expect(
      listTagsByLetters(shuffle([tagzxy, tagdef, tagaaa, tag2, tagAbc, tag1])),
    ).toEqual(expectedResult);
  });
});
