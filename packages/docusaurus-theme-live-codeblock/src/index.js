/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const {validateThemeConfig} = require('./validateThemeConfig');
const {readDefaultCodeTranslationMessages} = require('@docusaurus/utils');

function theme(context) {
  const {
    i18n: {currentLocale},
  } = context;

  return {
    name: 'docusaurus-theme-live-codeblock',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        dirPath: path.resolve(__dirname, 'codeTranslations'),
        locale: currentLocale,
      });
    },

    configureWebpack() {
      return {
        resolve: {
          alias: {
            buble: path.resolve(__dirname, './custom-buble.js'),
          },
        },
      };
    },
  };
}

module.exports = theme;

theme.validateThemeConfig = validateThemeConfig;
