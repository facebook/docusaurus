/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import normalizeLocation from '../normalizeLocation';

describe('normalizeLocation', () => {
  test('rewrite locations with index.html', () => {
    expect(
      normalizeLocation({
        pathname: '/docs/introduction/index.html',
        search: '#features',
        hash: '',
      }),
    ).toEqual({
      pathname: '/docs/introduction',
      search: '#features',
      hash: '',
    });

    expect(
      normalizeLocation({
        pathname: '/index.html',
        search: '#features',
        hash: '',
      }),
    ).toEqual({
      pathname: '/',
      search: '#features',
      hash: '',
    });
  });

  test('untouched pathnames', () => {
    expect(
      normalizeLocation({
        pathname: '/docs/introduction',
        search: '#features',
        hash: '',
      }),
    ).toEqual({
      pathname: '/docs/introduction',
      search: '#features',
      hash: '',
    });

    expect(
      normalizeLocation({
        pathname: '/',
      }),
    ).toEqual({
      pathname: '/',
    });
  });
});
