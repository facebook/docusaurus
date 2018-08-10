/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const gaze = require('gaze');
const tinylr = require('tiny-lr');
const constants = require('../core/constants');
const readMetadata = require('./readMetadata.js');

function startLiveReload() {
  process.env.NODE_ENV = 'development';
  const server = tinylr();
  server.listen(constants.LIVE_RELOAD_PORT, () => {
    console.log(
      'LiveReload server started on port %d',
      constants.LIVE_RELOAD_PORT
    );
  });

  gaze(
    [`../${readMetadata.getDocsPath()}/**/*`, '**/*', '!node_modules/**/*'],
    function() {
      this.on('all', () => {
        server.notifyClients(['/']);
      });
    }
  );
}

module.exports = startLiveReload;
