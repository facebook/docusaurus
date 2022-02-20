/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {DocusaurusPluginVersionInformation} from '@docusaurus/types';
import fs from 'fs-extra';
import path from 'path';

export async function getPackageJsonVersion(
  packageJsonPath: string,
): Promise<string | undefined> {
  if (await fs.pathExists(packageJsonPath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
    const {version} = require(packageJsonPath);
    return typeof version === 'string' ? version : undefined;
  }
  return undefined;
}

export async function getPackageJsonName(
  packageJsonPath: string,
): Promise<string | undefined> {
  if (await fs.pathExists(packageJsonPath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
    const {name} = require(packageJsonPath);
    return typeof name === 'string' ? name : undefined;
  }
  return undefined;
}

export async function getPluginVersion(
  pluginPath: string,
  siteDir: string,
): Promise<DocusaurusPluginVersionInformation> {
  let potentialPluginPackageJsonDirectory = path.dirname(pluginPath);
  while (potentialPluginPackageJsonDirectory !== '/') {
    const packageJsonPath = path.join(
      potentialPluginPackageJsonDirectory,
      'package.json',
    );
    if (
      (await fs.pathExists(packageJsonPath)) &&
      (await fs.lstat(packageJsonPath)).isFile()
    ) {
      if (potentialPluginPackageJsonDirectory === siteDir) {
        // If the plugin belongs to the same docusaurus project, we classify it
        // as local plugin.
        return {type: 'project'};
      }
      return {
        type: 'package',
        name: await getPackageJsonName(packageJsonPath),
        version: await getPackageJsonVersion(packageJsonPath),
      };
    }
    potentialPluginPackageJsonDirectory = path.dirname(
      potentialPluginPackageJsonDirectory,
    );
  }
  // In the case where a plugin is a path where no parent directory contains
  // package.json (e.g. inline plugin), we can only classify it as local.
  return {type: 'local'};
}
