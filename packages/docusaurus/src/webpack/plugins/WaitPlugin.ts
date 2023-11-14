/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {stat} from 'fs/promises';
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

async function waitOn(filepath: string): Promise<void> {
  const pollingIntervalMs = 300;
  const stabilityWindowMs = 750;

  let lastFileSize = -1;
  let lastFileTime = -1;

  for (;;) {
    const size = await fileSize(filepath);

    if (size !== null) {
      if (size === lastFileSize) {
        if (performance.now() - lastFileTime >= stabilityWindowMs) {
          return;
        }
      } else {
        lastFileSize = size;
        lastFileTime = performance.now();
      }
    }

    await new Promise((resolve) => {
      setTimeout(resolve, pollingIntervalMs);
    });
  }
}

async function fileSize(filepath: string): Promise<number | null> {
  try {
    return (await stat(filepath)).size;
  } catch (err) {
    return null;
  }
}
