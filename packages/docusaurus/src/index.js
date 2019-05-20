/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import build from './commands/build';
import init from './commands/init';
import start from './commands/start';
import swizzle from './commands/swizzle';
import deploy from './commands/deploy';

module.exports = {
  build,
  swizzle,
  init,
  start,
  deploy,
};
