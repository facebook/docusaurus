/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';
import type {LoadContext, Plugin} from '@docusaurus/types';

export default function themeMermaid(context: LoadContext): Plugin<void> {
  const {
    i18n: {currentLocale},
  } = context;

  return {
    name: 'docusaurus-theme-mermaid',

    getThemePath() {
      return '../lib/theme';
    },
    getTypeScriptThemePath() {
      return '../src/theme';
    },

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'theme-mermaid',
      });
    },

    contentLoaded() {},

    async postBuild() {},

    injectHtmlTags() {
      return {};
    },
  };
}

export {validateThemeConfig} from './validateThemeConfig';
