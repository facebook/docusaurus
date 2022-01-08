/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import {fileURLToPath} from 'url';

/**
 * Copy all untyped and static assets files to lib.
 */
const srcDir = fileURLToPath(new URL('src', import.meta.url));
const libDir = fileURLToPath(new URL('lib', import.meta.url));
await fs.copy(srcDir, libDir, {
  filter(filepath) {
    return !/__tests__/.test(filepath) && !/\.tsx?$/.test(filepath);
  },
});
