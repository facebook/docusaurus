/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.join(process.cwd(), 'src');
const libDir = path.join(process.cwd(), 'lib');

const ignoredPattern = /__tests__|\.tsx?$/;

async function copy() {
  await fs.promises.cp(srcDir, libDir, {
    recursive: true,
    filter(testedPath) {
      return !ignoredPattern.test(testedPath);
    },
  });
}

if (process.argv.includes('--watch')) {
  // A single file save can emit several events: coalesce them into one copy
  let timeout;
  fs.watch(srcDir, {recursive: true}, (eventType, filename) => {
    // filename is relative to srcDir, and is not always provided
    if (filename && ignoredPattern.test(path.join(srcDir, filename))) {
      return;
    }
    clearTimeout(timeout);
    timeout = setTimeout(copy, 100);
  });
} else {
  await copy();
}
