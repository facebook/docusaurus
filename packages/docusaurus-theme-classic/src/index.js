/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

const DEFAULT_OPTIONS = {};

class DocusaurusThemeDefault {
  constructor(context, opts) {
    this.options = {...DEFAULT_OPTIONS, ...opts};
    this.context = context;
  }

  getName() {
    return 'docusaurus-theme-classic';
  }

  getThemePath() {
    return path.resolve(__dirname, './theme');
  }
}

module.exports = DocusaurusThemeDefault;
