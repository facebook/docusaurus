/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const chokidar = require('chokidar');

class WaitPlugin {
  constructor(options) {
    this.filepath = options.filepath;
  }

  apply(compiler) {
    // Before finishing the compilation step
    compiler.hooks.make.tapAsync('WaitPlugin', (compilation, callback) => {
      const {filepath} = this;
      const watcher = chokidar.watch(filepath, {
        awaitWriteFinish: true,
        disableGlobbing: true,
      });

      watcher.on('add', () => {
        if (fs.existsSync(filepath)) {
          watcher.close();
          callback();
        }
      });
    });
  }
}

module.exports = WaitPlugin;
