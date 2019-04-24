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
        persistent: false,
      });

      const checkCondition = () => {
        if (Array.isArray(filepath)) {
          return filepath.every(file => fs.existsSync(file));
        }
        return fs.existsSync(filepath);
      };

      watcher.on('add', () => {
        if (checkCondition()) {
          watcher.close();
          callback();
        }
      });
    });
  }
}

module.exports = WaitPlugin;
