/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';

/**
 * Copy all untyped and static assets files to lib.
 */
const srcDir = path.resolve(__dirname, 'src');
const libDir = path.resolve(__dirname, 'lib');
await fs.copy(srcDir, libDir, {
  filter(filepath) {
    return !/__tests__/.test(filepath) && !/\.tsx?$/.test(filepath);
  },
});
