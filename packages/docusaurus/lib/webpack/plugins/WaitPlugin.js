/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs');

class WaitPlugin {
  constructor(options) {
    this.timeout = options.timeout || 60000;
    this.interval = options.interval || 250;
    this.filepath = options.filepath;
  }

  apply(compiler) {
    // Before finishing the compilation step
    compiler.hooks.make.tapAsync('WaitPlugin', (compilation, callback) => {
      const start = Date.now();
      const {filepath, timeout, interval} = this;

      const checkCondition = () => {
        if (Array.isArray(filepath)) {
          return filepath.every(file => fs.existsSync(file));
        }
        return fs.existsSync(filepath);
      };

      // Poll until file exist
      function poll() {
        if (checkCondition()) {
          callback();
        } else if (Date.now() - start > timeout) {
          throw Error("Maybe it just wasn't meant to be.");
        } else {
          setTimeout(poll, interval);
        }
      }

      poll();
    });
  }
}

module.exports = WaitPlugin;
