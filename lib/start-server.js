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
const tcpPortUsed = require('tcp-port-used');

const CWD = process.cwd();
const env = require('./server/env.js');

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

let port = parseInt(program.port, 10) || process.env.PORT || 3000;
let numAttempts = 0;
const MAX_ATTEMPTS = 10;

function checkPort() {
  tcpPortUsed
    .check(port, 'localhost')
    .then(inUse => {
      if (inUse && numAttempts >= MAX_ATTEMPTS) {
        console.log(
          'Reached max attempts, exiting. Please open up some ports or ' +
            'increase the number of attempts and try again.'
        );
        process.exit(1);
      } else if (inUse) {
        console.error(chalk.red(`Port ${port} is in use`));
        // Try again but with port + 1
        port += 1;
        numAttempts += 1;
        checkPort();
      } else {
        // start local server on specified port
        const server = require('./server/server.js');
        server(port, program.opts());
        const {baseUrl} = require(`${CWD}/siteConfig.js`);
        const host = `http://localhost:${port}${baseUrl}`;
        console.log('Docusaurus server started on port %d', port);
        openBrowser(host);
      }
    })
    .catch(ex => {
      setTimeout(() => {
        throw ex;
      }, 0);
    });
}

checkPort();
