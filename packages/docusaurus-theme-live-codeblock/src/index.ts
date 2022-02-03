/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';
import type {LoadContext, Plugin} from '@docusaurus/types';

export default function themeLiveCodeblock(context: LoadContext): Plugin {
  const {
    i18n: {currentLocale},
  } = context;

  return {
    name: 'docusaurus-theme-live-codeblock',

    getThemePath() {
      return path.resolve(__dirname, '../lib/theme');
    },
    getTypeScriptThemePath() {
      return path.resolve(__dirname, '../src/theme');
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'theme-live-codeblock',
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

export {validateThemeConfig} from './validateThemeConfig';
