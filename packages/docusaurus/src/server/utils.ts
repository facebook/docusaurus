/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import chalk from 'chalk';
import flatMap from 'lodash.flatmap';
import {RouteConfig} from '@docusaurus/types';

// TODO temporary escape hatch for alpha-60: to be removed soon
// Our validation schemas might be buggy at first
// will permit users to bypass validation until we fix all validation errors
// see for example: https://github.com/facebook/docusaurus/pull/3120
// Undocumented on purpose, as we don't want users to keep using it over time
// Maybe we'll make this escape hatch official some day, with a better api?
export const isValidationDisabledEscapeHatch =
  process.env.DISABLE_DOCUSAURUS_VALIDATION === 'true';

isValidationDisabledEscapeHatch &&
  console.error(
    chalk.red(
      'You should avoid using DISABLE_DOCUSAURUS_VALIDATION escape hatch, this will be removed',
    ),
  );

export const logValidationBugReportHint = () => {
  console.log(
    `\n${chalk.red('A validation error occured.')}${chalk.cyanBright(
      '\nThe validation system was added recently to Docusaurus as an attempt to avoid user configuration errors.' +
        '\nWe may have made some mistakes.' +
        '\nIf you think your configuration is valid and should keep working, please open a bug report.',
    )}\n`,
  );
};

// Recursively get the final routes (routes with no subroutes)
export function getFinalRoutes(route: RouteConfig): RouteConfig[] {
  return route.routes ? flatMap(route.routes, getFinalRoutes) : [route];
}
