/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ChineseWord2Pinyin} from '../pinyin/src/index';

describe('getFirstLetterFromChinese', () => {
  it('included chinese --> a lower-cased alphabet', () => {
    expect(ChineseWord2Pinyin('你')).toEqual(['ni']);
    expect(ChineseWord2Pinyin('我们')).toEqual(['wo', 'men']);
  });

  it('excluded chinese --> unchanged', () => {
    // todo: support 繁體字
    expect(ChineseWord2Pinyin('妳')).toEqual(['妳']);
    // 生僻字应该不需要支持（就提取标签来说）
    expect(ChineseWord2Pinyin('犇')).toEqual(['犇']);
  });

  it('non-chinese --> unchanged (but separated)', () => {
    // english
    expect(ChineseWord2Pinyin('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
  });

  it('mixture --> mixture and separated', () => {
    expect(ChineseWord2Pinyin('facebook好棒')).toEqual([
      'f',
      'a',
      'c',
      'e',
      'b',
      'o',
      'o',
      'k',
      'hao',
      'bang',
    ]);
  });
});
