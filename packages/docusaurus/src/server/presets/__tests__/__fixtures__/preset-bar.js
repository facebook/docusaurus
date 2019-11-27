/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function preset(context, opts = {}) {
  return {
    plugins: [
      ['@docusaurus/plugin-content-docs', opts.docs],
      ['@docusaurus/plugin-content-blog', opts.blog],
    ],
  };
};
