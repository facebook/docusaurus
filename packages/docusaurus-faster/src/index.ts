/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RuleSetRule} from 'webpack';

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
