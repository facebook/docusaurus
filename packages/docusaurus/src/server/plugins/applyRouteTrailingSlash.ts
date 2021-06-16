/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RouteConfig} from '@docusaurus/types';
import {applyTrailingSlash} from '@docusaurus/utils-common';

export default function applyRouteTrailingSlash(
  route: RouteConfig,
  trailingSlash: boolean | undefined,
) {
  // Never transform "/" to "" => cause router issues ("" catch everything)
  if (route.path === '/') {
    return route;
  }

  return {
    ...route,
    path: applyTrailingSlash(route.path, trailingSlash),
    ...(route.routes && {
      routes: route.routes.map((subroute) =>
        applyRouteTrailingSlash(subroute, trailingSlash),
      ),
    }),
  };
}
