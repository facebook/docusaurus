/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const tcpPortUsed = require('tcp-port-used');
const chalk = require('chalk');
const MAX_ATTEMPTS = 10;

function checkPort(port, content, numOfAttempts) {
  tcpPortUsed
    .check(port, 'localhost')
    .then(function(inUse) {
      if (inUse && numOfAttempts >= MAX_ATTEMPTS) {
        console.log(
          'Reached max attempts, exiting. Please open up some ports or ' +
            'increase the number of attempts and try again.'
        );
        process.exit(1);
      } else if (inUse) {
        console.error(chalk.red('Port ' + port + ' is in use'));
        port += 1;
        numOfAttempts += 1;
        checkPort(port, content, numOfAttempts);
      } else {
        content(port);
      }
    })
    .catch(function(ex) {
      setTimeout(function() {
        throw ex;
      }, 0);
    });
}

module.exports = checkPort;
