/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) and gatsby-remark-autolink-headers (https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers) */

const visit = require('unist-util-visit');
const toString = require('mdast-util-to-string');
const slugs = require('github-slugger')();

const customHeadingIdRegex = /^(.*?)\s*\{#([\w-]+)\}$/;

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
        const heading = toString(
          headingTextNodes.length > 0
            ? {children: headingTextNodes}
            : headingNode,
        );

        // Support explicit heading IDs
        const customHeadingIdMatches = customHeadingIdRegex.exec(heading);

        if (customHeadingIdMatches) {
          id = customHeadingIdMatches[2];

          // Remove the custom ID part from the text node
          if (headingNode.children.length > 1) {
            headingNode.children.pop();
          } else {
            const lastNode =
              headingNode.children[headingNode.children.length - 1];
            lastNode.value = customHeadingIdMatches[1] || heading;
          }
        } else {
          id = slugs.slug(heading);
        }
      }

      data.id = id;
      properties.id = id;
    }

    visit(ast, 'heading', visitor);
  };

  return transformer;
}

module.exports = slug;
