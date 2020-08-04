/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        // prevent importing server code in client bundle
        patterns: [
          '**/../babel/**',
          '**/../server/**',
          '**/../commands/**',
          '**/../webpack/**',
          '**/../constants',
        ],
      },
    ],
  },
};
