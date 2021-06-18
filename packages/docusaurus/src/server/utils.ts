/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {flatMap} from 'lodash';
import {RouteConfig} from '@docusaurus/types';
import globby from 'globby';
import nodePath from 'path';
import {posixPath} from '@docusaurus/utils';

// Recursively get the final routes (routes with no subroutes)
export function getAllFinalRoutes(routeConfig: RouteConfig[]): RouteConfig[] {
  function getFinalRoutes(route: RouteConfig): RouteConfig[] {
    return route.routes ? flatMap(route.routes, getFinalRoutes) : [route];
  }
  return flatMap(routeConfig, getFinalRoutes);
}

// Globby that fix Windows path patterns
// See https://github.com/facebook/docusaurus/pull/4222#issuecomment-795517329
export async function safeGlobby(
  patterns: string[],
  options?: globby.GlobbyOptions,
): Promise<string[]> {
  // Required for Windows support, as paths using \ should not be used by globby
  // (also using the windows hard drive prefix like c: is not a good idea)
  const globPaths = patterns.map((dirPath) =>
    posixPath(nodePath.relative(process.cwd(), dirPath)),
  );

  return globby(globPaths, options);
}
