/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  env: {
    // USED FOR NODE/RUNTIME
    // maybe we should differenciate both cases because
    // we mostly need to transpile some features so that node does not crash...
    lib: {
      presets: [
        ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
      ],
      // Useful to transpile for older node versions
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },

    // USED FOR JS SWIZZLE
    // /lib-next folder is used as source to swizzle JS source code
    // This JS code is created from TS source code
    // This source code should look clean/human readable to be usable
    'lib-next': {
      presets: [
        ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
      ],
    },
  },
};
