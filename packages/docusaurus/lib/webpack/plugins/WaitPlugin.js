/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const fs = require('fs');

class WaitPlugin extends WebpackBeforeBuildPlugin {
  constructor(file, interval = 300, timeout = 30000) {
    super(
      (stats, callback) => {
        const start = Date.now();
        fs.writeFileSync('start.js', new Date().toString());

        function poll() {
          if (fs.existsSync(file)) {
            fs.writeFileSync('stop.js', new Date().toString());
            callback();
          } else if (Date.now() - start > timeout) {
            throw Error("Maybe it just wasn't meant to be.");
          } else {
            setTimeout(poll, interval);
          }
        }

        poll();
      },
      ['make'],
    );
  }
}

module.exports = WaitPlugin;
