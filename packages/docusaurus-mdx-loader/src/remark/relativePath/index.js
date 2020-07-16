/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const visit = require('unist-util-visit');

const plugin = () => {
  const transformer = (root) => {
    visit(root, 'image', (node) => {
      if (node.url.startsWith('.')) {
        node.type = 'jsx';
        node.value = `<img ${node.alt ? `alt={"${node.alt}"}` : ''} ${
          node.url ? `src={require("!url-loader!${node.url}").default}` : ''
        } ${node.title ? `title={"${node.title}"}` : ''} />`;
        if (node.url) {
          delete node.url;
        }
        if (node.alt) {
          delete node.alt;
        }
        if (node.title) {
          delete node.title;
        }
      }
    });
  };

  return transformer;
};

module.exports = plugin;
