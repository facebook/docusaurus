/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


const path = require('path');

module.exports = function (_context, _options) {
  return {
    name: 'docusaurus-theme-bootstrap',
    getThemePath() {
      return path.resolve(__dirname, './theme');
    },
    getClientModules() {
      return [
        'bootstrap/dist/css/bootstrap.min.css',
        path.resolve(__dirname, './prism-include-languages')
      ];
    }
  }
}
