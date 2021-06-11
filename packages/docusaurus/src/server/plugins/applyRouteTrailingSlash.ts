/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RouteConfig} from '@docusaurus/types';
import {addTrailingSlash, removeTrailingSlash} from '@docusaurus/utils';

export default function applyRouteTrailingSlash(
  route: RouteConfig,
  trailingSlash: boolean | undefined,
) {
  // Never transform "/" to "" => cause router issues ("" catch everything)
  if (route.path === '/') {
    return route;
  }

  function getNewRoutePath() {
    // undefined = legacy retrocompatible behavior
    if (typeof trailingSlash === 'undefined') {
      return route.path;
    }
    // The trailing slash should be handled before the ?search#hash !
    // For routing #anchor is normally not possible, but querystring remains possible
    const [pathname] = route.path.split(/[#?]/);
    const newPathname = trailingSlash
      ? addTrailingSlash(pathname)
      : removeTrailingSlash(pathname);
    return route.path.replace(pathname, newPathname);
  }

  return {
    ...route,
    path: getNewRoutePath(),
    ...(route.routes && {
      routes: route.routes.map((subroute) =>
        applyRouteTrailingSlash(subroute, trailingSlash),
      ),
    }),
  };
}
