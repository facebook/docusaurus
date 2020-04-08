/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

module.exports = function () {
  return {
    themes: [
      // This is required simce the package was not published
      path.resolve(__dirname, '../../docusaurus-theme-bootstrap'),
    ],
    // ['@docusaurus/plugin-content-blog', opts.blog]
    plugins: [],
  };
};
