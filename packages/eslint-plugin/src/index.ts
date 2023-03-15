/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rules from './rules';

export = {
  rules,
  configs: {
    recommended: {
      plugins: ['@docusaurus'],
      rules: {
        '@docusaurus/string-literal-i18n-messages': 'error',
        '@docusaurus/no-html-links': 'warn',
        '@docusaurus/prefer-docusaurus-heading': 'warn',
      },
    },
    all: {
      plugins: ['@docusaurus'],
      rules: {
        '@docusaurus/string-literal-i18n-messages': 'error',
        '@docusaurus/no-untranslated-text': 'warn',
        '@docusaurus/no-html-links': 'warn',
        '@docusaurus/prefer-docusaurus-heading': 'warn',
      },
    },
  },
};
