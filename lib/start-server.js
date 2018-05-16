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

// For verifying port usage
const tcpPortUsed = require('tcp-port-used');

// initial check that required files are present
const chalk = require('chalk');
const fs = require('fs');
const opn = require('opn');
const CWD = process.cwd();

if (!fs.existsSync(CWD + '/siteConfig.js')) {
  console.error(
    chalk.red('Error: No siteConfig.js file found in website folder!')
  );
  process.exit(1);
}

const program = require('commander');

program.option('--port <number>', 'Specify port number').parse(process.argv);

let port = parseInt(program.port, 10) || process.env.PORT || 3000;
let numAttempts = 0;
const MAX_ATTEMPTS = 10;
checkPort();

function checkPort() {
  tcpPortUsed
    .check(port, 'localhost')
    .then(function(inUse) {
      if (inUse && numAttempts >= MAX_ATTEMPTS) {
        console.log(
          'Reached max attempts, exiting. Please open up some ports or ' +
            'increase the number of attempts and try again.'
        );
        process.exit(1);
      } else if (inUse) {
        console.error(chalk.red('Port ' + port + ' is in use'));
        // Try again but with port + 1
        port += 1;
        numAttempts += 1;
        checkPort();
      } else {
        // start local server on specified port
        const server = require('./server/server.js');
        server(port);
        const host = `http://localhost:${port}`;
        console.log('Docusaurus server started on port %d', port);
        opn(host);
      }
    })
    .catch(function(ex) {
      setTimeout(function() {
        throw ex;
      }, 0);
    });
}
