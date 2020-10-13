/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = function (_context, _options) {
  return {
    name: 'docusaurus-remark-plugin-npm2yarn',
    getClientModules() {
      return [path.resolve(__dirname, './npm2yarn/index.js')];
    },
  };
};
