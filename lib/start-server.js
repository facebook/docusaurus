#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('babel-register')({
  babelrc: false,
  only: [__dirname, `${process.cwd()}/core`],
  plugins: [
    require('./server/translate-plugin.js'),
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
  presets: ['react', 'env'],
});

const chalk = require('chalk');
const fs = require('fs');
const program = require('commander');
const openBrowser = require('react-dev-utils/openBrowser');
const findUnusedPort = require('./findUnusedPort.js');

const CWD = process.cwd();
const env = require('./server/env.js');

const liveReloadServer = require('./server/liveReloadServer.js');
const docusaurusServer = require('./server/server.js');

if (!fs.existsSync(`${CWD}/siteConfig.js`)) {
  console.error(
    chalk.red('Error: No siteConfig.js file found in website folder!')
  );
  process.exit(1);
}

if (env.versioning.enabled && env.versioning.missingVersionsPage) {
  env.versioning.printMissingVersionsPageError();
  process.exit(1);
}

program
  .option('--port <number>', 'Specify port number')
  .option('--no-watch', 'Toggle live reload file watching')
  .parse(process.argv);

function startLiveReloadServer() {
  const initalLiveReloadPort = 35729;
  const promise = findUnusedPort(initalLiveReloadPort).then(port => {
    liveReloadServer.start(port);
  });

  return promise;
}

function startDocusaurusServer() {
  const initialServerPort =
    parseInt(program.port, 10) || process.env.PORT || 3000;
  const promise = findUnusedPort(initialServerPort).then(port => {
    docusaurusServer(port);
    const {baseUrl} = require(`${CWD}/siteConfig.js`);
    const serverAddress = `http://localhost:${port}${baseUrl}`;
    console.log('Docusaurus server started on port %d', port);
    openBrowser(serverAddress);
  });

  return promise;
}

function start() {
  startLiveReloadServer()
    .catch(ex => console.warn(`failed to start live reload server: ${ex}`))
    .then(() => startDocusaurusServer())
    .catch(ex => {
      console.error(`failed to start Docusaurus server: ${ex}`);
      process.exit(1);
    });
}

start();
