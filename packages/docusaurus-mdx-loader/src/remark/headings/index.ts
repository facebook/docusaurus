/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* Based on remark-slug (https://github.com/remarkjs/remark-slug) and gatsby-remark-autolink-headers (https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-autolink-headers) */

import {parseMarkdownHeadingId, createSlugger} from '@docusaurus/utils';
import type {Plugin, Transformer} from 'unified';
import type {Heading, Root, Text} from 'mdast';

export interface PluginOptions {
  anchorsMaintainCase: boolean;
}

function getCommentHeadingId(heading: Heading): string | undefined {
  const lastChild = heading.children.at(-1);

  console.log('Last child of heading:', lastChild);

  return undefined;
}

const plugin: Plugin<PluginOptions[], Root> = function plugin({
  anchorsMaintainCase,
}): Transformer<Root> {
  return async (root) => {
    const {toString} = await import('mdast-util-to-string');
    const {visit} = await import('unist-util-visit');

    function getHeadingText(heading: Heading) {
      const headingTextNodes = heading.children.filter(
        ({type}) => !['html', 'jsx'].includes(type),
      );
      return toString(headingTextNodes.length > 0 ? headingTextNodes : heading);
    }

    const slugs = createSlugger();
    visit(root, 'heading', (headingNode) => {
      const data = headingNode.data ?? (headingNode.data = {});
      const properties = (data.hProperties || (data.hProperties = {})) as {
        id: string;
      };

      function setId(newId: string) {
        data.id = newId;
        properties.id = newId;
      }

      // properties.id already set? Not sure when this happens, historical code
      if (properties.id) {
        const id = slugs.slug(properties.id, {maintainCase: true});
        setId(id);
        
      }
      // No id set
      else {
        // Try to find an explicit id in MD/MDX comments
        const commentId = getCommentHeadingId(headingNode);
        if (commentId) {
          // Remove the comment node
          headingNode.children.pop();
          // Trim the trailing space from the last text node ("txt " → "txt")
          const newLast = headingNode.children.at(-1);
          if (newLast?.type === 'text') {
            newLast.value = newLast.value.trimEnd();
          }

          setId(commentId);
          return;
        }

        const headingText = getHeadingText(headingNode);

        // Try to find an explicit id in the heading text (legacy syntax)
        const parsedHeading = parseMarkdownHeadingId(
          getHeadingText(headingNode),
        );
        // Remove the heading text from its id (legacy syntax)
        if (parsedHeading.id) {
          // When there's an id, it is always in the last child node
          const lastNode = headingNode.children.at(-1) as Text;
          if (headingNode.children.length > 1) {
            const lastNodeText = parseMarkdownHeadingId(lastNode.value).text;
            // When the last part contains text + id, remove the id
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

        const id =
          parsedHeading.id ??
          slugs.slug(headingText, {maintainCase: anchorsMaintainCase});

        setId(id);
        
      }
    });
  };
};

export default plugin;
