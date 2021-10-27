/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RouteConfig} from '@docusaurus/types';
import {
  applyTrailingSlash,
  ApplyTrailingSlashParams,
} from '@docusaurus/utils-common';
import {getRouteRanking} from '@docusaurus/utils';

export default function applyRouteTrailingSlash(
  route: RouteConfig,
  params: ApplyTrailingSlashParams,
): RouteConfig {
  const path = applyTrailingSlash(route.path, params);
  return {
    ...route,
    path,
    ranking: getRouteRanking(path),
    ...(route.routes && {
      routes: route.routes.map((subroute) =>
        applyRouteTrailingSlash(subroute, params),
      ),
    }),
  };
}
