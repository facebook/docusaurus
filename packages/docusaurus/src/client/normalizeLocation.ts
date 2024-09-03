/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {matchRoutes} from 'react-router-config';
import routes from '@generated/routes';
import type {Location} from 'history';

// Memoize previously normalized pathnames.
const pathnames = new Map<string, string>();

export default function normalizeLocation<T extends Location>(location: T): T {
  if (pathnames.has(location.pathname)) {
    return {
      ...location,
      pathname: pathnames.get(location.pathname),
    };
  }

  // If the location was registered with an `.html` extension, we don't strip it
  // away, or it will render to a 404 page.
  const matchedRoutes = matchRoutes(routes, location.pathname);
  if (matchedRoutes.some(({route}) => route.exact === true)) {
    pathnames.set(location.pathname, location.pathname);
    return location;
  }

  const pathname =
    location.pathname.trim().replace(/(?:\/index)?\.html$/, '') || '/';

  pathnames.set(location.pathname, pathname);

  return {
    ...location,
    pathname,
  };
}
