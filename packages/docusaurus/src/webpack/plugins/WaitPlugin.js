/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs-extra');
const {waitFile} = require('wait-file');

class WaitPlugin {
  constructor(options) {
    this.filepath = options.filepath;
  }

  apply(compiler) {
    // Before finishing the compilation step
    compiler.hooks.make.tapAsync('WaitPlugin', (compilation, callback) => {
      // To prevent 'waitFile' error on waiting non-existing directory
      fs.ensureDirSync(path.dirname(this.filepath));

      // Wait until file exist
      waitFile({
        resources: [this.filepath],
        interval: 300,
      })
        .then(() => {
          callback();
        })
        .catch(error => {
          console.warn(`WaitPlugin error: ${error}`);
        });
    });
  }
}

module.exports = WaitPlugin;
