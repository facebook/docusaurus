/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import chalk from 'chalk';
import {RouteConfig, OnDuplicateRoutes} from '@docusaurus/types';

export function getAllDuplicateRoutes(
  pluginsRouteConfigs: RouteConfig[],
): string[] {
  const routesSeen: Record<string, any> = {};
  const duplicateRoutes: string[] = [];
  function getDuplicateRoutes(routeConfigs: RouteConfig[]): string[] {
    for (let i = 0; i < routeConfigs.length; i += 1) {
      const routeConfig = routeConfigs[i];
      if (routesSeen.hasOwnProperty(routeConfig.path)) {
        duplicateRoutes.push(routeConfig.path);
      } else {
        routesSeen[routeConfig.path] = true; // dummy value for object
      }
      if (routeConfig.routes !== undefined) {
        getDuplicateRoutes(routeConfig.routes);
      }
    }
    return duplicateRoutes;
  }
  return getDuplicateRoutes(pluginsRouteConfigs);
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
  onDuplicateRoutes: OnDuplicateRoutes,
): void {
  if (onDuplicateRoutes === 'ignore') {
    return;
  }
  const duplicatePaths: string[] = getAllDuplicateRoutes(pluginsRouteConfigs);
  const message: string = getDuplicateRoutesMessage(duplicatePaths);
  if (message) {
    const finalMessage = `Duplicate routes found!\n${message}\nThis could lead to non-deterministic routing behavior`;
    if (onDuplicateRoutes === 'log') {
      console.log(chalk.blue(finalMessage));
    } else if (onDuplicateRoutes === 'warn') {
      console.warn(chalk.yellow(finalMessage));
    } else if (onDuplicateRoutes === 'throw') {
      throw new Error(finalMessage);
    }
  }
}

export function warnAboutOverridingRoutes(
  pluginsRouteConfigs: RouteConfig[],
): void {
  // Accumulate all the routes by recursively exploring each RouteConfig
  const routesAccumulator: string[] = [];
  function getAllRoutes(routeConfigs: RouteConfig[]): string[] {
    for (let i = 0; i < routeConfigs.length; i += 1) {
      const routeConfig = routeConfigs[i];
      routesAccumulator.push(routeConfig.path);
      if (routeConfig.routes !== undefined) {
        getAllRoutes(routeConfig.routes);
      }
    }
    return routesAccumulator;
  }

  const allRoutes = getAllRoutes(pluginsRouteConfigs);

  // Sort the allRoutes array in lexicographical order
  // Then check if each route is equal to the next route
  // If yes, one of these routes will be overridden so we warn the user
  allRoutes.sort((a, b) => a.localeCompare(b));
  for (let i = 0; i < allRoutes.length - 1; i += 1) {
    if (allRoutes[i] === allRoutes[i + 1]) {
      console.warn(
        `${
          chalk.yellow(`warning `) + chalk.bold.yellow(`Routes Override: `)
        }Attempting to create page at "${
          allRoutes[i]
        }" but a page already exists at this path\n${chalk.bold.yellow(
          `This could lead to non-deterministic routing behavior`,
        )}`,
      );
    }
  }
}
