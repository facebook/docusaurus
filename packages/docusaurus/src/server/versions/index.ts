/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocusaurusPluginVersionInformation} from '@docusaurus/types';
import {existsSync, lstatSync} from 'fs-extra';
import {dirname, join} from 'path';

export function getPackageJsonVersion(
  packageJsonPath: string,
): string | undefined {
  if (existsSync(packageJsonPath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
    const {version} = require(packageJsonPath);
    return typeof version === 'string' ? version : undefined;
  }
  return undefined;
}

export function getPackageJsonName(
  packageJsonPath: string,
): string | undefined {
  if (existsSync(packageJsonPath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
    const {name} = require(packageJsonPath);
    return typeof name === 'string' ? name : undefined;
  }
  return undefined;
}

export function getPluginVersion(
  pluginPath: string,
  siteDir: string,
): DocusaurusPluginVersionInformation {
  let potentialPluginPackageJsonDirectory = dirname(pluginPath);
  while (potentialPluginPackageJsonDirectory !== '/') {
    const packageJsonPath = join(
      potentialPluginPackageJsonDirectory,
      'package.json',
    );
    if (existsSync(packageJsonPath) && lstatSync(packageJsonPath).isFile()) {
      if (potentialPluginPackageJsonDirectory === siteDir) {
        // If the plugin belongs to the same docusaurus project, we classify it as local plugin.
        return {type: 'project'};
      }
      return {
        type: 'package',
        name: getPackageJsonName(packageJsonPath),
        version: getPackageJsonVersion(packageJsonPath),
      };
    }
    potentialPluginPackageJsonDirectory = dirname(
      potentialPluginPackageJsonDirectory,
    );
  }
  // In rare cases where a plugin is a path where no parent directory contains package.json, we can only classify it as local.
  return {type: 'local'};
}
