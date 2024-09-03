/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RuleSetRule} from 'webpack';
import type {JsMinifyOptions} from '@swc/core';

export function getSwcJsLoaderFactory({
  isServer,
}: {
  isServer: boolean;
}): RuleSetRule {
  return {
    loader: require.resolve('swc-loader'),
    options: {
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
        target: 'es2017',
      },
      module: {
        type: isServer ? 'commonjs' : 'es6',
      },
    },
  };
}

// Note: these options are similar to what we use in core
// They should rather be kept in sync for now to avoid any unexpected behavior
// The goal of faster minifier is not to fine-tune options but only to be faster
// See core minification.ts
export function getSwcJsMinifierOptions(): JsMinifyOptions {
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
