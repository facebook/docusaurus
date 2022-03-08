/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {ReportingSeverity, RouteConfig} from '@docusaurus/types';
import {reportMessage} from '@docusaurus/utils';
import {getAllFinalRoutes} from './utils';

function getAllDuplicateRoutes(pluginsRouteConfigs: RouteConfig[]): string[] {
  const allRoutes: string[] = getAllFinalRoutes(pluginsRouteConfigs).map(
    (routeConfig) => routeConfig.path,
  );
  const seenRoutes = new Set<string>();
  return allRoutes.filter((route) => {
    if (seenRoutes.has(route)) {
      return true;
    }
    seenRoutes.add(route);
    return false;
  });
}

function getDuplicateRoutesMessage(allDuplicateRoutes: string[]): string {
  const message = allDuplicateRoutes
    .map(
      (duplicateRoute) =>
        `- Attempting to create page at ${duplicateRoute}, but a page already exists at this route.`,
    )
    .join('\n');
  return message;
}

export function handleDuplicateRoutes(
  pluginsRouteConfigs: RouteConfig[],
  onDuplicateRoutes: ReportingSeverity,
): void {
  if (onDuplicateRoutes === 'ignore') {
    return;
  }
  const duplicatePaths: string[] = getAllDuplicateRoutes(pluginsRouteConfigs);
  const message: string = getDuplicateRoutesMessage(duplicatePaths);
  if (message) {
    const finalMessage = `Duplicate routes found!
${message}
This could lead to non-deterministic routing behavior.`;
    reportMessage(finalMessage, onDuplicateRoutes);
  }
}
