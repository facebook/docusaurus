/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {Plugin} from '@docusaurus/types';

export default function theme(): Plugin {
  return {
    name: 'docusaurus-theme-live-codeblock',

    getThemePath() {
      return path.resolve(__dirname, './theme');
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
