/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const visit = require('unist-util-visit');
const path = require('path');
const url = require('url');
const fs = require('fs-extra');

const plugin = (options) => {
  const transformer = (root) => {
    visit(root, 'image', (node) => {
      if (!url.parse(node.url).protocol) {
        if (!path.isAbsolute(node.url)) {
          if (
            !fs.existsSync(path.join(path.dirname(options.filePath), node.url))
          ) {
            throw new Error(
              `Image ${path.join(
                path.dirname(options.filePath),
                node.url,
              )} used in ${options.filePath} not found.`,
            );
          }
          node.type = 'jsx';
          node.value = `<img ${node.alt ? `alt={"${node.alt}"}` : ''} ${
            node.url
              ? `src={require("!url-loader!${
                  node.url.startsWith('./') ? node.url : `./${node.url}`
                }").default}`
              : ''
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
        } else if (!fs.existsSync(path.join(options.staticDir, node.url))) {
          throw new Error(
            `Image ${path.join(options.staticDir, node.url)} used in ${
              options.filePath
            } not found.`,
          );
        }
      }
    });
  };

  return transformer;
};

module.exports = plugin;
