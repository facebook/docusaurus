/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import browserslist from 'browserslist';
import semver from 'semver';
import type {JsMinifyOptions, Options as SwcOptions} from '@swc/core';
import type {CurrentBundler} from '@docusaurus/types';

export function getSwcLoaderOptions({
  isServer,
  bundlerName,
  clientBrowserslistQueries,
}: {
  isServer: boolean;
  bundlerName: CurrentBundler['name'];
  clientBrowserslistQueries: string[];
}): SwcOptions {
  return {
    env: {
      targets: isServer
        ? getServerBrowserslistQueries({bundlerName})
        : clientBrowserslistQueries,
    },
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
      experimental: {
        // Required to match import attributes in rules, see
        // https://rspack.rs/config/module-rules#ruleswith
        keepImportAttributes: true,
      },
    },
  };
}

// Note: these options are similar to the Terser options we use
// They should rather be kept in sync for now to avoid any unexpected behavior
// The SWC minifier goal is not to fine-tune options but only to be faster
// See minification.ts
export function getSwcJsMinimizerOptions(): JsMinifyOptions {
  return {
    ecma: 2020,
    compress: {
      ecma: 5,
    },
    module: true,
    mangle: true,
    safari10: true,
    format: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  };
}

type SwcHtmlMinifier = (typeof import('@swc/html'))['minify'];

// Import it lazily: not need for the dev server, more performant
// This also temporarily fix our StackBlitz playground
// See https://github.com/facebook/docusaurus/issues/12008
// See https://github.com/swc-project/swc/issues/11833
export async function importSwcHtmlMinifier(): Promise<SwcHtmlMinifier> {
  const {minify} = await import('@swc/html');
  return minify;
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

function getServerBrowserslistQueries({
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
