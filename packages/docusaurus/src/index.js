/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const build = require('./commands/build');
const init = require('./commands/init');
const start = require('./commands/start');
const swizzle = require('./commands/swizzle');
const deploy = require('./commands/deploy');

module.exports = {
  build,
  swizzle,
  init,
  start,
  deploy,
};
