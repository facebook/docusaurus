/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {translation} = require('./env.js');

function translate(str) {
  return translation.t(str, 'pages');
}

module.exports = {
  translate,
};
