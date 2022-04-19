/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const requireIndex = require('requireindex');

module.exports = {
  rules: requireIndex(`${__dirname}/rules`),
  configs: {
    recommended: {
      rules: {
        '@docusaurus/no-dynamic-i18n-messages': 'error',
      },
    },
    all: {
      rules: {
        '@docusaurus/no-dynamic-i18n-messages': 'error',
        '@docusaurus/no-untranslated-text': 'warn',
      },
    },
  },
};
