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
        patterns: [
          // Prevent importing lodash in client bundle for bundle size
          'lodash',
          'lodash.**',
          'lodash/**',
          // Prevent importing server code in client bundle
          '**/../babel/**',
          '**/../server/**',
          '**/../commands/**',
          '**/../webpack/**',
        ],
      },
    ],
  },
};
