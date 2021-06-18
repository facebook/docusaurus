/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = function () {
  return {
    name: 'docusaurus-theme-bootstrap',
    getThemePath() {
      return path.resolve(__dirname, '..', 'lib', 'theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },
    getClientModules() {
      return [require.resolve('bootstrap/dist/css/bootstrap.min.css')];
    },
  };
};
