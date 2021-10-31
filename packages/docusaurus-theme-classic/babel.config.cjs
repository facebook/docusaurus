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
    },
  },
};
