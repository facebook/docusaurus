/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const tcpPortUsed = require('tcp-port-used');

function findUnusedPort(initalPort) {
  const maxAttempts = 10;
  let numAttempts = 0;

  const host = 'localhost';
  const checkPort = port => {
    const promise = tcpPortUsed.check(port, host).then(inUse => {
      if (!inUse) {
        return Promise.resolve(port);
      }

      numAttempts++;
      if (numAttempts === maxAttempts) {
        return Promise.reject(
          new Error('cannot find unused port: max attempts exceeded')
        );
      }
      return checkPort(port + 1);
    });
    return promise;
  };

  return checkPort(initalPort);
}

module.exports = findUnusedPort;
