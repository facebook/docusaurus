/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Plugin} from '@docusaurus/types';

export default function theme(): Plugin {
  return {
    name: 'docusaurus-theme-live-codeblock',

    getThemePath() {
      return new URL('./theme', import.meta.url).pathname;
    },

    configureWebpack() {
      return {
        resolve: {
          alias: {
            buble: new URL('./custom-buble.js', import.meta.url).pathname,
          },
        },
      };
    },
  };
}

export {validateThemeConfig} from './validateThemeConfig';
