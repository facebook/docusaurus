/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {ReportingSeverity, RouteConfig} from '@docusaurus/types';
import {reportMessage} from '@docusaurus/utils';
import {getAllFinalRoutes} from './utils';

export function getAllDuplicateRoutes(
  pluginsRouteConfigs: RouteConfig[],
): string[] {
  const allRoutes: string[] = getAllFinalRoutes(pluginsRouteConfigs).map(
    (routeConfig) => routeConfig.path,
  );
  const seenRoutes: Record<string, any> = {};
  return allRoutes.filter((route) => {
    if (Object.prototype.hasOwnProperty.call(seenRoutes, route)) {
      return true;
    } else {
      seenRoutes[route] = true;
      return false;
    }
  });
}

export function getDuplicateRoutesMessage(
  allDuplicateRoutes: string[],
): string {
  const message = allDuplicateRoutes
    .map(
      (duplicateRoute) =>
        `Attempting to create page at ${duplicateRoute}, but a page already exists at this route`,
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
    const finalMessage = `Duplicate routes found!\n${message}\nThis could lead to non-deterministic routing behavior`;
    reportMessage(finalMessage, onDuplicateRoutes);
  }
}
