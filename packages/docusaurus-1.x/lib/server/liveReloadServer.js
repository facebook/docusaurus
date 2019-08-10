/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const gaze = require('gaze');
const tinylr = require('tiny-lr');
const program = require('commander');
const readMetadata = require('./readMetadata.js');

function start(port) {
  process.env.NODE_ENV = 'development';
  process.env.LIVERELOAD_PORT = port;
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
}

const getReloadScriptUrl = () => {
  // Please, JS programmer show me how to save state of 'program' globally for each
  // invocation of this function.
  
  // hacked in
  program
  .option('--port <number>', 'Specify port number')
  .option('--no-watch', 'Toggle live reload file watching')
  .option('--host <host>', 'use specified host (default: localhost)')
  .parse(process.argv);

  // hacked in
  program.parse(process.argv)

  const port = process.env.LIVERELOAD_PORT;
  const host = program.host || 'localhost';

  return `http://${host}:${port}/livereload.js`;
};

module.exports = {
  start,
  getReloadScriptUrl,
};
