/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import chalk from 'chalk';
import flatMap from 'lodash.flatmap';
import {RouteConfig, ReportingSeverity} from '@docusaurus/types';

// Recursively get the final routes (routes with no subroutes)
export function getAllFinalRoutes(routeConfig: RouteConfig[]): RouteConfig[] {
  function getFinalRoutes(route: RouteConfig): RouteConfig[] {
    return route.routes ? flatMap(route.routes, getFinalRoutes) : [route];
  }
  return flatMap(routeConfig, getFinalRoutes);
}

export function reportMessage(
  message: string,
  reportingSeverity: ReportingSeverity,
): void {
  switch (reportingSeverity) {
    case 'ignore':
      break;
    case 'log':
      console.log(chalk.bold.blue('info ') + chalk.blue(message));
      break;
    case 'warn':
      console.warn(chalk.bold.yellow('warn ') + chalk.yellow(message));
      break;
    case 'error':
      console.error(chalk.bold.red('error ') + chalk.red(message));
      break;
    case 'throw':
      throw new Error(message);
    default:
      throw new Error(
        `unexpected reportingSeverity value: ${reportingSeverity}`,
      );
  }
}
