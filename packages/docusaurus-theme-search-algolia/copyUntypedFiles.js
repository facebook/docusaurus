/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';

/**
 * Copy all untyped and static assets files to lib.
 */
fs.copySync(
  new URL('src', import.meta.url).pathname,
  new URL('lib', import.meta.url).pathname,
  {
    filter(filepath) {
      return !/__tests__/.test(filepath) && !/\.tsx?$/.test(filepath);
    },
  },
);
