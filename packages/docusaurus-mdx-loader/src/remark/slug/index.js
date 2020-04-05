/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) */

const visit = require('unist-util-visit');
const toString = require('mdast-util-to-string');
const slugs = require('github-slugger')();

function slug() {
  const transformer = (ast) => {
    slugs.reset();

    function visitor(headingNode) {
      const data = headingNode.data || (headingNode.data = {}); // eslint-disable-line
      const properties = data.hProperties || (data.hProperties = {});
      let {id} = properties;

      if (id) {
        id = slugs.slug(id, true);
      } else {
        const headingTextNodes = headingNode.children.filter(
          ({type}) => !['html', 'jsx'].includes(type),
        );
        const normalizedHeadingNode =
          headingTextNodes.length > 0
            ? {children: headingTextNodes}
            : headingNode;
        id = slugs.slug(toString(normalizedHeadingNode));
      }

      data.id = id;
      properties.id = id;
    }

    visit(ast, 'heading', visitor);
  };

  return transformer;
}

module.exports = slug;
