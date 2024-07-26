/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {DOCUSAURUS_VERSION} from '@docusaurus/utils';
import type {
  LoadedPlugin,
  PluginVersionInformation,
  SiteMetadata,
} from '@docusaurus/types';

async function loadPackageJsonVersion(
  packageJsonPath: string,
): Promise<string | undefined> {
  if (await fs.pathExists(packageJsonPath)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
    return (require(packageJsonPath) as {version?: string}).version;
  }
  return undefined;
}

async function loadPackageJsonName(
  packageJsonPath: string,
): Promise<string | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
  return (require(packageJsonPath) as {name?: string}).name;
}

export async function loadSiteVersion(
  siteDir: string,
): Promise<string | undefined> {
  return loadPackageJsonVersion(path.join(siteDir, 'package.json'));
}

export async function loadPluginVersion(
  pluginPath: string,
  siteDir: string,
): Promise<PluginVersionInformation> {
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
        name: await loadPackageJsonName(packageJsonPath),
        version: await loadPackageJsonVersion(packageJsonPath),
      };
    }
    potentialPluginPackageJsonDirectory = path.dirname(
      potentialPluginPackageJsonDirectory,
    );
  }
  // In the case where a plugin is a path where no parent directory contains
  // package.json, we can only classify it as local. Could happen if one puts a
  // script in the parent directory of the site.
  return {type: 'local'};
}

/**
 * We want all `@docusaurus/*` packages to have the exact same version!
 * @see https://github.com/facebook/docusaurus/issues/3371
 * @see https://github.com/facebook/docusaurus/pull/3386
 */
function checkDocusaurusPackagesVersion(siteMetadata: SiteMetadata) {
  const {docusaurusVersion} = siteMetadata;
  Object.entries(siteMetadata.pluginVersions).forEach(
    ([plugin, versionInfo]) => {
      if (
        versionInfo.type === 'package' &&
        versionInfo.name?.startsWith('@docusaurus/') &&
        versionInfo.version &&
        versionInfo.version !== docusaurusVersion
      ) {
        throw new Error(`Invalid name=${plugin} version number=${versionInfo.version}.
All official @docusaurus/* packages should have the exact same version as @docusaurus/core (number=${docusaurusVersion}).
Maybe you want to check, or regenerate your yarn.lock or package-lock.json file?`);
      }
    },
  );
}

export function createSiteMetadata({
  siteVersion,
  plugins,
}: {
  siteVersion: string | undefined;
  plugins: LoadedPlugin[];
}): SiteMetadata {
  const siteMetadata: SiteMetadata = {
    docusaurusVersion: DOCUSAURUS_VERSION,
    siteVersion,
    pluginVersions: Object.fromEntries(
      plugins
        .filter(({version: {type}}) => type !== 'synthetic')
        .map(({name, version}) => [name, version]),
    ),
  };
  checkDocusaurusPackagesVersion(siteMetadata);
  return siteMetadata;
}
