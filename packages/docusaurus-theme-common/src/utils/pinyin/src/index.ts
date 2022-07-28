/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import pinyinMap_ from '../data/pinyin.json';

const pinyinMap: {[key: string]: string} = pinyinMap_;

/**
 * convert a single chinese character to pinyin
 * @param chineseChar: a Chinese string
 */
export function ChineseChar2pinyin(chineseChar: string): string {
  if (chineseChar.length !== 1) {
    throw new Error('must be a single char!');
  }

  if (Object.keys(pinyinMap).includes(chineseChar)) {
    return pinyinMap[chineseChar] as string;
  }

  return chineseChar;
}

/**
 * convert a chinese word to pinyin
 * @param chineseWord
 * @constructor
 */
export function ChineseWord2Pinyin(chineseWord: string): string[] {
  const pinyin = chineseWord.split('').map(ChineseChar2pinyin);
  const failed = chineseWord.split('').filter((c, i) => c === pinyin[i]);
  if (failed.length) {
    console.warn(`character of [${failed}] failed to be converted`);
  }
  return pinyin;
}

/**
 * potentially useful
 * @param char
 */
export function isChinese(char: string): boolean {
  return /[\u2e80-\u2fd5]/.test(char);
}
