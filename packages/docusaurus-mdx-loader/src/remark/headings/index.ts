/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) and gatsby-remark-autolink-headers (https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers) */

import {parseMarkdownHeadingId, createSlugger} from '@docusaurus/utils';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {Heading, Text} from 'mdast';

export interface PluginOptions {
  anchorsMaintainCase: boolean;
}

export default function plugin({
  anchorsMaintainCase,
}: PluginOptions): Transformer {
  return async (root) => {
    const {toString} = await import('mdast-util-to-string');
    const {visit} = await import('unist-util-visit');

    const slugs = createSlugger();
    visit(root, 'heading', (headingNode: Heading) => {
      const data = headingNode.data ?? (headingNode.data = {});
      const properties = (data.hProperties || (data.hProperties = {})) as {
        id: string;
      };
      let {id} = properties;

      if (id) {
        id = slugs.slug(id, {maintainCase: true});
      } else {
        const headingTextNodes = headingNode.children.filter(
          ({type}) => !['html', 'jsx'].includes(type),
        );
        const heading = toString(
          headingTextNodes.length > 0 ? headingTextNodes : headingNode,
        );

        // Support explicit heading IDs
        const parsedHeading = parseMarkdownHeadingId(heading);

        id =
          parsedHeading.id ??
          slugs.slug(heading, {maintainCase: anchorsMaintainCase});

        if (parsedHeading.id) {
          // When there's an id, it is always in the last child node
          // Sometimes heading is in multiple "parts" (** syntax creates a child
          // node):
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
    });
  };
}
