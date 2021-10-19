/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = function preset(context, opts = {}) {
  return {
    themes: [[require.resolve('@docusaurus/theme-bootstrap'), opts.theme]],
    plugins: [
      [
        opts.pages !== false &&
          require.resolve('@docusaurus/plugin-content-pages'),
        opts.pages,
      ],
      [
        opts.blog !== false &&
          require.resolve('@docusaurus/plugin-content-blog'),
        opts.blog,
      ],
      [
        opts.docs !== false &&
          require.resolve('@docusaurus/plugin-content-docs'),
        opts.docs,
      ],
    ],
  };
};
