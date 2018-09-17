/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const gaze = require('gaze');
const tinylr = require('tiny-lr');
const readMetadata = require('./readMetadata.js');

let reloadScriptUrl;

function start(port) {
  process.env.NODE_ENV = 'development';
  const server = tinylr();
  server.listen(port, () => {
    console.log('LiveReload server started on port %d', port);
  });

  gaze(
    [`../${readMetadata.getDocsPath()}/**/*`, '**/*', '!node_modules/**/*'],
    function() {
      this.on('all', () => {
        server.notifyClients(['/']);
      });
    },
  );

  reloadScriptUrl = `http://localhost:${port}/livereload.js`;
}

const getReloadScriptUrl = () => reloadScriptUrl;

module.exports = {
  start,
  getReloadScriptUrl,
};
