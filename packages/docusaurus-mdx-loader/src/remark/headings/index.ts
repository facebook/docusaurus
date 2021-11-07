/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) and gatsby-remark-autolink-headers (https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers) */

import {parseMarkdownHeadingId} from '@docusaurus/utils';
import visit, {Visitor} from 'unist-util-visit';
import toString from 'mdast-util-to-string';
import Slugger from 'github-slugger';
import type {Transformer} from 'unified';
import type {Parent} from 'unist';
import type {Heading, Text} from 'mdast';

const slugs = new Slugger();

function headings(): Transformer {
  const transformer: Transformer = (ast) => {
    slugs.reset();

    const visitor: Visitor<Heading> = (headingNode) => {
      const data = headingNode.data || (headingNode.data = {});
      const properties = (data.hProperties || (data.hProperties = {})) as {
        id: string;
      };
      let {id} = properties;

      if (id) {
        id = slugs.slug(id, true);
      } else {
        const headingTextNodes = headingNode.children.filter(
          ({type}) => !['html', 'jsx'].includes(type),
        );
        const heading = toString(
          headingTextNodes.length > 0
            ? ({children: headingTextNodes} as Parent)
            : headingNode,
        );

        // Support explicit heading IDs
        const parsedHeading = parseMarkdownHeadingId(heading);

        id = parsedHeading.id || slugs.slug(heading);

        if (parsedHeading.id) {
          // When there's an id, it is always in the last child node
          // Sometimes heading is in multiple "parts" (** syntax creates a child node):
          // ## part1 *part2* part3 {#id}
          const lastNode = headingNode.children[
            headingNode.children.length - 1
          ] as Text;

          if (headingNode.children.length > 1) {
            const lastNodeText = parseMarkdownHeadingId(lastNode.value).text;
            // When last part contains test+id, remove the id
            if (lastNodeText) {
              lastNode.value = lastNodeText;
            }
            // When last part contains only the id: completely remove that node
            else {
              headingNode.children.pop();
            }
          } else {
            lastNode.value = parsedHeading.text;
          }
        }
      }

      data.id = id;
      properties.id = id;
    };

    visit(ast, 'heading', visitor);
  };

  return transformer;
}

export default headings;
