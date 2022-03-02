/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Location} from 'history';

// Memoize previously normalized pathnames.
const pathnames: Record<string, string> = {};

export default function normalizeLocation<T extends Location>(location: T): T {
  if (pathnames[location.pathname]) {
    return {
      ...location,
      pathname: pathnames[location.pathname],
    };
  }

  let pathname = location.pathname || '/';
  pathname = pathname.trim().replace(/\/index\.html$/, '');

  if (pathname === '') {
    pathname = '/';
  }

  pathnames[location.pathname] = pathname;

  return {
    ...location,
    pathname,
  };
}
