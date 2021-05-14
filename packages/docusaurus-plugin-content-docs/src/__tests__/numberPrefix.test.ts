/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  DefaultNumberPrefixParser,
  DisabledNumberPrefixParser,
  stripNumberPrefix,
  stripPathNumberPrefixes,
} from '../numberPrefix';

const IgnoredNumberPrefixPatterns = [
  // Patterns without number prefix
  'MyDoc',
  'a1-My Doc',
  'My Doc-000',
  'My Doc - 1',
  'My Doc - 02',
  'Hey - 03 - My Doc',
  '00abc01-My Doc',
  'My 001- Doc',
  'My -001 Doc',
  // ignore common date-like patterns: https://github.com/facebook/docusaurus/issues/4640
  '2021-01-31 - Doc',
  '31-01-2021 - Doc',
  '2021_01_31 - Doc',
  '31_01_2021 - Doc',
  '2021.01.31 - Doc',
  '31.01.2021 - Doc',
  '2021-01 - Doc',
  '2021_01 - Doc',
  '2021.01 - Doc',
  '01-2021 - Doc',
  '01_2021 - Doc',
  '01.2021 - Doc',
  // date patterns without suffix
  '2021-01-31',
  '2021-01',
  '21-01-31',
  '21-01',
  '2021_01_31',
  '2021_01',
  '21_01_31',
  '21_01',
  '01_31',
  '01',
  '2021',
  '01',
  // ignore common versioning patterns: https://github.com/facebook/docusaurus/issues/4653
  '8.0',
  '8.0.0',
  '14.2.16',
  '18.2',
  '8.0 - Doc',
  '8.0.0 - Doc',
  '8_0',
  '8_0_0',
  '14_2_16',
  '18_2',
  '8.0 - Doc',
  '8.0.0 - Doc',
];

describe('stripNumberPrefix', () => {
  function stripNumberPrefixDefault(str: string) {
    return stripNumberPrefix(str, DefaultNumberPrefixParser);
  }

  test('should strip number prefix if present', () => {
    expect(stripNumberPrefixDefault('1-My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('01-My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001-My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001 - My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001      -    My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('999      -        My Doc')).toEqual(
      'My Doc',
    );
    //
    expect(stripNumberPrefixDefault('1---My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('01---My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001---My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001 --- My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001      ---    My Doc')).toEqual(
      'My Doc',
    );
    expect(stripNumberPrefixDefault('999      ---        My Doc')).toEqual(
      'My Doc',
    );
    //
    expect(stripNumberPrefixDefault('1___My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('01___My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001___My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001 ___ My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001      ___    My Doc')).toEqual(
      'My Doc',
    );
    expect(stripNumberPrefixDefault('999      ___        My Doc')).toEqual(
      'My Doc',
    );
    //
    expect(stripNumberPrefixDefault('1.My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('01.My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001.My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001 . My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('001      .    My Doc')).toEqual('My Doc');
    expect(stripNumberPrefixDefault('999      .       My Doc')).toEqual(
      'My Doc',
    );
  });

  test('should not strip number prefix if pattern does not match', () => {
    IgnoredNumberPrefixPatterns.forEach((badPattern) => {
      expect(stripNumberPrefixDefault(badPattern)).toEqual(badPattern);
    });
  });
});

describe('stripPathNumberPrefix', () => {
  test('should strip number prefixes in paths', () => {
    expect(
      stripPathNumberPrefixes(
        '0-MyRootFolder0/1 - MySubFolder1/2.  MyDeepFolder2/3 _MyDoc3',
        DefaultNumberPrefixParser,
      ),
    ).toEqual('MyRootFolder0/MySubFolder1/MyDeepFolder2/MyDoc3');
  });

  test('should strip number prefixes in paths with custom parser', () => {
    function stripPathNumberPrefixCustom(str: string) {
      return {
        filename: str.substring(1, str.length),
        numberPrefix: 0,
      };
    }

    expect(
      stripPathNumberPrefixes('aaaa/bbbb/cccc', stripPathNumberPrefixCustom),
    ).toEqual('aaa/bbb/ccc');
  });

  test('should strip number prefixes in paths with disabled parser', () => {
    expect(
      stripPathNumberPrefixes(
        '0-MyRootFolder0/1 - MySubFolder1/2.  MyDeepFolder2/3 _MyDoc3',
        DisabledNumberPrefixParser,
      ),
    ).toEqual('0-MyRootFolder0/1 - MySubFolder1/2.  MyDeepFolder2/3 _MyDoc3');
  });
});

describe('DefaultNumberPrefixParser', () => {
  test('should extract number prefix if present', () => {
    expect(DefaultNumberPrefixParser('0-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 0,
    });
    expect(DefaultNumberPrefixParser('1-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(DefaultNumberPrefixParser('01-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(DefaultNumberPrefixParser('001-My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(DefaultNumberPrefixParser('001 - My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(DefaultNumberPrefixParser('001      -    My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 1,
    });
    expect(DefaultNumberPrefixParser('999      -        My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 999,
    });

    expect(DefaultNumberPrefixParser('0046036 - My Doc')).toEqual({
      filename: 'My Doc',
      numberPrefix: 46036,
    });
  });

  test('should not extract number prefix if pattern does not match', () => {
    IgnoredNumberPrefixPatterns.forEach((badPattern) => {
      expect(DefaultNumberPrefixParser(badPattern)).toEqual({
        filename: badPattern,
        numberPrefix: undefined,
      });
    });
  });
});
