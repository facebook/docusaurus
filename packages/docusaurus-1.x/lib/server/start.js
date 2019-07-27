/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const program = require('commander');
const openBrowser = require('react-dev-utils/openBrowser');
const portFinder = require('portfinder');
const liveReloadServer = require('./liveReloadServer.js');
const server = require('./server.js');

const CWD = process.cwd();

function startLiveReloadServer() {
  const promise = portFinder.getPortPromise({port: 35729}).then(port => {
    liveReloadServer.start(port);
  });
  return promise;
}

function startServer() {
  const initialServerPort =
    parseInt(program.port, 10) || process.env.PORT || 3000;
  const host = program.host || 'localhost';
  const promise = portFinder
    .getPortPromise({port: initialServerPort})
    .then(port => {
      server(port, host);
      const {baseUrl} = require(`${CWD}/siteConfig.js`);
      const serverAddress = `http://${host}:${port}${baseUrl}`;
      console.log('Docusaurus server started on port %d', port);
      openBrowser(serverAddress);
    });
  return promise;
}

function startDocusaurus() {
  if (program.watch) {
    return startLiveReloadServer()
      .catch(ex => console.warn(`Failed to start live reload server: ${ex}`))
      .then(() => startServer());
  }
  return startServer();
}

module.exports = {
  startDocusaurus,
  startServer,
  startLiveReloadServer,
};
