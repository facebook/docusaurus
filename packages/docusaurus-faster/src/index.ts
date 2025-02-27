/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Rspack from '@rspack/core';
import * as lightningcss from 'lightningcss';
import browserslist from 'browserslist';
import {minify as swcHtmlMinifier} from '@swc/html';
import type {JsMinifyOptions, Options as SwcOptions} from '@swc/core';

export const swcLoader = require.resolve('swc-loader');

export const getSwcLoaderOptions = ({
  isServer,
}: {
  isServer: boolean;
}): SwcOptions => {
  return {
    env: {
      targets: getBrowserslistQueries({isServer}),
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
    },
  };
};

export const rspack: typeof Rspack = Rspack;

export function getSwcHtmlMinifier(): typeof swcHtmlMinifier {
  return swcHtmlMinifier;
}

// Note: these options are similar to what we use in core
// They should rather be kept in sync for now to avoid any unexpected behavior
// The goal of faster minifier is not to fine-tune options but only to be faster
// See core minification.ts
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

// We need this because of Rspack built-in LightningCSS integration
// See https://github.com/orgs/browserslist/discussions/846
export function getBrowserslistQueries({
  isServer,
}: {
  isServer: boolean;
}): string[] {
  if (isServer) {
    return [`node ${process.versions.node}`];
  }

  const queries = browserslist.loadConfig({path: process.cwd()}) ?? [
    ...browserslist.defaults,
  ];
  return queries;
}

// LightningCSS doesn't expose any type for css-minimizer-webpack-plugin setup
// So we derive it ourselves
// see https://lightningcss.dev/docs.html#with-webpack
type LightningCssMinimizerOptions = Omit<
  lightningcss.TransformOptions<never>,
  'filename' | 'code'
>;

export function getLightningCssMinimizerOptions(): LightningCssMinimizerOptions {
  const queries = browserslist();
  return {targets: lightningcss.browserslistToTargets(queries)};
}
