/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  extractNumberPrefix,
  stripNumberPrefix,
  stripPathNumberPrefixes,
} from '../numberPrefix';

const BadNumberPrefixPatterns = [
  'a1-My Doc',
  'My Doc-000',
  '00abc01-My Doc',
  'My 001- Doc',
  'My -001 Doc',
];

describe('stripNumberPrefix', () => {
  test('should strip number prefix if present', () => {
    expect(stripNumberPrefix('1-My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('01-My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001-My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001 - My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001      -    My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('999      -        My Doc')).toEqual('My Doc');
    //
    expect(stripNumberPrefix('1---My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('01---My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001---My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001 --- My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001      ---    My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('999      ---        My Doc')).toEqual('My Doc');
    //
    expect(stripNumberPrefix('1___My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('01___My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001___My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001 ___ My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001      ___    My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('999      ___        My Doc')).toEqual('My Doc');
    //
    expect(stripNumberPrefix('1.My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('01.My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001.My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001 . My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('001      .    My Doc')).toEqual('My Doc');
    expect(stripNumberPrefix('999      .       My Doc')).toEqual('My Doc');
  });

  test('should not strip number prefix if pattern does not match', () => {
    BadNumberPrefixPatterns.forEach((badPattern) => {
      expect(stripNumberPrefix(badPattern)).toEqual(badPattern);
    });
  });
});

describe('stripPathNumberPrefix', () => {
  test('should strip number prefixes in paths', () => {
    expect(
      stripPathNumberPrefixes(
        '0-MyRootFolder0/1 - MySubFolder1/2.  MyDeepFolder2/3 _MyDoc3',
      ),
    ).toEqual('MyRootFolder0/MySubFolder1/MyDeepFolder2/MyDoc3');
  });
});

describe('extractNumberPrefix', () => {
  test('should extract number prefix if present', () => {
    expect(extractNumberPrefix('0-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 0,
    });
    expect(extractNumberPrefix('1-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(extractNumberPrefix('01-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(extractNumberPrefix('001-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(extractNumberPrefix('001 - My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(extractNumberPrefix('001      -    My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(extractNumberPrefix('999      -        My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 999,
    });

    expect(extractNumberPrefix('0046036 - My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 46036,
    });
  });

  test('should not extract number prefix if pattern does not match', () => {
    BadNumberPrefixPatterns.forEach((badPattern) => {
      expect(extractNumberPrefix(badPattern)).toEqual({
        filename: badPattern,
        numberPrefix: undefined,
      });
    });
  });
});
