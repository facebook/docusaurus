/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
  // import all rules in lib/rules
  rules: requireIndex(`${__dirname}/rules`),
  configs: {
    recommended: {
      rules: {
        'docusaurus/no-dynamic-i18n-messages': 'error',
      },
    },
    all: {
      rules: {
        'docusaurus/no-dynamic-i18n-messages': 'error',
        'docusaurus/no-untranslated-text': 'warn',
      },
    },
  },
};
