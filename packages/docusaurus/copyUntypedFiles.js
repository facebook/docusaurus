/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');
const fs = require('fs-extra');

/**
 * Copy all untyped and static assets files to lib.
 */
const srcDir = path.resolve(__dirname, 'src');
const libDir = path.resolve(__dirname, 'lib');
fs.copySync(srcDir, libDir, {
  filter(filepath) {
    return !/__tests__/.test(filepath) && !/\.ts$/.test(filepath);
  },
});
