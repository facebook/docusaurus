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
        search: '?search=foo',
        hash: '#features',
      }),
    ).toEqual({
      pathname: '/docs/introduction',
      search: '?search=foo',
      hash: '#features',
    });

    expect(
      normalizeLocation({
        pathname: '/index.html',
        search: '',
        hash: '#features',
      }),
    ).toEqual({
      pathname: '/',
      search: '',
      hash: '#features',
    });
  });

  test('pathnames without html extension', () => {
    expect(
      normalizeLocation({
        pathname: '/docs/introduction',
        search: '',
        hash: '#features',
      }),
    ).toEqual({
      pathname: '/docs/introduction',
      search: '',
      hash: '#features',
    });

    expect(
      normalizeLocation({
        pathname: '/docs/introduction/foo.html',
        search: '',
        hash: '#bar',
      }),
    ).toEqual({
      pathname: '/docs/introduction/foo',
      search: '',
      hash: '#bar',
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
