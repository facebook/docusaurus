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

  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@theme/Footer': path.resolve(__dirname, './theme/Footer'),
          '@theme/Layout': path.resolve(__dirname, './theme/Layout'),
          '@theme/Navbar': path.resolve(__dirname, './theme/Navbar'),
          '@theme/NotFound': path.resolve(__dirname, './theme/NotFound'),
          '@theme/Search': path.resolve(__dirname, './theme/Search'),
        },
      },
    };
  }
}

module.exports = DocusaurusThemeDefault;
