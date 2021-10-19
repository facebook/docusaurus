/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import waitOn from 'wait-on';
import {Compiler} from 'webpack';

interface WaitPluginOptions {
  filepath: string;
}

export default class WaitPlugin {
  filepath: string;

  constructor(options: WaitPluginOptions) {
    this.filepath = options.filepath;
  }

  apply(compiler: Compiler): void {
    // Before finishing the compilation step
    compiler.hooks.make.tapAsync('WaitPlugin', (compilation, callback) => {
      // To prevent 'waitFile' error on waiting non-existing directory
      fs.ensureDir(path.dirname(this.filepath), {}, () => {
        // Wait until file exist
        waitOn({
          resources: [this.filepath],
          interval: 300,
        })
          .then(() => {
            callback();
          })
          .catch((error: Error) => {
            console.warn(`WaitPlugin error: ${error}`);
          });
      });
    });
  }
}
