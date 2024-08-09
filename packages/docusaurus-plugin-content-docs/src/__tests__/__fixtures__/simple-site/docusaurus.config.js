/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'My Site',
  tagline: 'The tagline of my site',
  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  markdown: {
    parseFrontMatter: async (params) => {
      // Reuse the default parser
      const result = await params.defaultParseFrontMatter(params);
      if (result.frontMatter.last_update?.author) {
        result.frontMatter.last_update.author =
          result.frontMatter.last_update.author +
          ' (processed by parseFrontMatter)';
      }
      return result;
    },
  },
};
