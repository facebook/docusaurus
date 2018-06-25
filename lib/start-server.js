#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('babel-register')({
  babelrc: false,
  only: [__dirname, process.cwd() + '/core'],
  plugins: [
    require('./server/translate-plugin.js'),
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
  presets: ['react', 'env'],
});

// initial check that required files are present
const chalk = require('chalk');
const fs = require('fs');
const openBrowser = require('react-dev-utils/openBrowser');
const CWD = process.cwd();
const env = require('./server/env.js');
const checkPort = require('./check-port');

if (!fs.existsSync(CWD + '/siteConfig.js')) {
  console.error(
    chalk.red('Error: No siteConfig.js file found in website folder!')
  );
  process.exit(1);
}

if (env.versioning.enabled && env.versioning.missingVersionsPage) {
  env.versioning.printMissingVersionsPageError();
  process.exit(1);
}

const program = require('commander');

program
  .option('--port <number>', 'Specify port number')
  .option('--no-watch', 'Toggle live reload file watching')
  .parse(process.argv);

let port = parseInt(program.port, 10) || process.env.PORT || 3000;
let numOfAttempts = 0;

const StartServer = port => {
  const server = require('./server/server.js');
  server(port, program.opts());
  const host = `http://localhost:${port}`;
  console.log('Docusaurus server started on port %d', port);
  openBrowser(host);
};

checkPort(port, StartServer, numOfAttempts);
