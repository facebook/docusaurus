/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import routes from '@generated/routes';
import {matchRoutes} from 'react-router-config';
import type {Location} from 'history';

// Memoize previously normalized pathnames.
const pathnames: {[rawPathname: string]: string} = {};

export default function normalizeLocation<T extends Location>(location: T): T {
  if (pathnames[location.pathname]) {
    return {
      ...location,
      pathname: pathnames[location.pathname],
    };
  }

  if (matchRoutes(routes, location.pathname)) {
    pathnames[location.pathname] = location.pathname;
    return location;
  }

  const pathname =
    location.pathname.trim().replace(/(?:\/index)?\.html$/, '') || '/';

  pathnames[location.pathname] = pathname;

  return {
    ...location,
    pathname,
  };
}
