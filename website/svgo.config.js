/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeTitle: false,
          removeViewBox: false,
        },
      },
    },
    {
      name: 'prefixIds',
      params: {
        delim: '',
        prefix: (_, info) => path.parse(info.path).name,
      },
    },
  ],
};
