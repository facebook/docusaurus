/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) and gatsby-remark-autolink-headers (https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers) */

import {parseMarkdownHeadingId, createSlugger} from '@docusaurus/utils';
import visit from 'unist-util-visit';
import mdastToString from 'mdast-util-to-string';
import type {Transformer} from 'unified';
import type {Heading} from 'mdast';

export default function plugin(): Transformer {
  return (root) => {
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
        const heading = mdastToString(
          headingTextNodes.length > 0 ? headingTextNodes : headingNode,
        );

        // Support explicit heading IDs
        const parsedHeading = parseMarkdownHeadingId(heading);

        if (parsedHeading.id) {
          id = parsedHeading.id;

          let trailingTextContainingId = '';
          let node = headingNode.children.pop();
          // Keep going back until the span of text nodes forms the heading ID
          while (
            node?.type === 'text' &&
            !parseMarkdownHeadingId(trailingTextContainingId).id
          ) {
            trailingTextContainingId = node.value + trailingTextContainingId;
            node = headingNode.children.pop();
          }
          // Last node popped was excess lookahead, so push it back
          if (node) {
            headingNode.children.push(node);
          }
          const {text: trailingText, id: contentId} = parseMarkdownHeadingId(
            trailingTextContainingId,
          );
          if (!contentId) {
            // If the trailing text does not contain an ID, this means the
            // ID extraction logic removed some Markdown markup from the "ID"
            // (e.g. ## Heading {#**id**}). The behavior here is undefined, so
            // we throw an error.
            throw new Error(
              `The heading ID must not contain Markdown markup. Heading: ${heading}`,
            );
          }
          if (trailingText) {
            // If the trailing text contains an ID, but also contains other
            // text, we add the trailing text as a new text node
            headingNode.children.push({
              type: 'text',
              value: trailingText,
            });
          }
        } else {
          id = slugs.slug(heading);
        }
      }

      data.id = id;
      properties.id = id;
    });
  };
}
