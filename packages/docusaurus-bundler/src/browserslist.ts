/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import browserslist from 'browserslist';
import semver from 'semver';
import {browserslistToTargets, type TransformOptions} from 'lightningcss';
import type {CurrentBundler} from '@docusaurus/types';

// Used when the site doesn't provide its own Browserslist config
// See https://web.dev/baseline
const DefaultBrowserslistQueries = ['baseline widely available'];

/**
 * The targets the client or server bundle is compiled for, like
 * `['baseline widely available']` or `['node 24.11.1']`
 */
export function getTargets({
  isServer,
  bundlerName,
}: {
  isServer: boolean;
  bundlerName: CurrentBundler['name'];
}): string[] {
  return isServer ? getServerTargets({bundlerName}) : getClientTargets();
}

export function getClientTargets(): string[] {
  return (
    browserslist.loadConfig({path: process.cwd()}) ?? DefaultBrowserslistQueries
  );
}

function getServerTargets({
  bundlerName,
}: {
  bundlerName: CurrentBundler['name'];
}): string[] {
  // Escape hatch env variable
  if (process.env.DOCUSAURUS_SERVER_NODE_TARGET) {
    return [`node ${process.env.DOCUSAURUS_SERVER_NODE_TARGET}`];
  }
  // For server builds, we want to use the current Node version as target
  // But we can't pass a target that Browserslist doesn't know about yet
  const nodeTarget = getMinVersion(
    process.versions.node,
    getLastBrowserslistKnownNodeVersion(bundlerName),
  );
  return [`node ${nodeTarget}`];
}

// TODO this is not accurate
//  for Rspack we should read from the built-in browserslist data
//  see https://github.com/facebook/docusaurus/pull/11496
function getLastBrowserslistKnownNodeVersion(
  bundlerName: CurrentBundler['name'],
): string {
  if (bundlerName === 'rspack') {
    // TODO hardcoded value until Rspack exposes its Browserslist data
    //  see https://github.com/facebook/docusaurus/pull/11496
    return '26.0.0';
  }
  // browserslist('last 1 node versions')[0]!.replace('node ', '')
  return browserslist.nodeVersions.at(-1)!;
}

function getMinVersion(v1: string, v2: string): string {
  return semver.lt(v1, v2) ? v1 : v2;
}

// LightningCSS doesn't expose any type for minimizer-webpack-plugin setup
// So we derive it ourselves
// see https://lightningcss.dev/docs.html#with-webpack
type LightningCssMinimizerOptions = Omit<
  TransformOptions<never>,
  'filename' | 'code'
>;

export function getLightningCssMinimizerOptions(): LightningCssMinimizerOptions {
  const browsers = browserslist(getClientTargets());
  return {targets: browserslistToTargets(browsers)};
}
