/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import type {Compiler} from 'webpack';

type WaitPluginOptions = {
  filepath: string;
};

export default class WaitPlugin {
  filepath: string;

  constructor(options: WaitPluginOptions) {
    this.filepath = options.filepath;
  }

  apply(compiler: Compiler): void {
    // Before finishing the compilation step
    compiler.hooks.make.tapPromise('WaitPlugin', () => waitOn(this.filepath));
  }
}

// This is a re-implementation of the algorithm used by the "wait-on" package
// https://github.com/jeffbski/wait-on/blob/master/lib/wait-on.js#L200
async function waitOn(filepath: string): Promise<void> {
  const pollingIntervalMs = 300;
  const stabilityWindowMs = 750;

  let lastFileSize = -1;
  let lastFileTime = -1;

  for (;;) {
    let size = -1;
    try {
      size = (await fs.stat(filepath)).size;
    } catch (err) {}

    if (size !== -1) {
      if (lastFileTime === -1 || size !== lastFileSize) {
        lastFileSize = size;
        lastFileTime = performance.now();
      } else if (performance.now() - lastFileTime >= stabilityWindowMs) {
        return;
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, pollingIntervalMs);
    });
  }
}
