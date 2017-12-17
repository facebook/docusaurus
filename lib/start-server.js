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
  plugins: [require('./server/translate-plugin.js')],
  presets: ['react', 'env'],
});

// For verifying port usage
const tcpPortUsed = require('tcp-port-used');

// initial check that required files are present
const chalk = require('chalk');
const fs = require('fs');
const CWD = process.cwd();

if (!fs.existsSync(CWD + '/siteConfig.js')) {
  console.error(
    chalk.red('Error: No siteConfig.js file found in website folder!')
  );
  process.exit(1);
}

const program = require('commander');

program.option('--port <number>', 'Specify port number').parse(process.argv);

const port = parseInt(program.port, 10) || 3000;

tcpPortUsed.check(port, 'localhost').then(function(inUse) {
  if (inUse) {
    console.error(chalk.red('Port ' + port + ' is in use'));
    process.exit(1);
  } else {
    console.log('Starting Docusaurus server on port ' + port + '...');
    // start local server on specified port
    const server = require('./server/server.js');
    server(port);
  }
});
