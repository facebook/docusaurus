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

// Try to find an explicit id in MD/MDX comments

function extractCommentId(heading: Heading) {
  const commentId = getCommentHeadingId(heading);
  if (commentId) {
    // Remove the last comment node
    heading.children.pop();
    // Trim the trailing space from the last text node ("text " → "text")
    const newLast = heading.children.at(-1);
    if (newLast?.type === 'text') {
      newLast.value = newLast.value.trimEnd();
    }
    return commentId;
  }
  return undefined;
}

// Try to find an explicit id in the heading text (legacy {#id} syntax)
function extractLegacySyntaxId(heading: Heading, headingText: string) {
  const parsedHeading = parseMarkdownHeadingId(headingText);
  // Remove the heading text from its id (legacy syntax)
  if (parsedHeading.id) {
    // When there's an id, it is always in the last child node
    const lastNode = heading.children.at(-1) as Text;
    if (heading.children.length > 1) {
      const lastNodeText = parseMarkdownHeadingId(lastNode.value).text;
      // When the last part contains text + id, remove the id
      if (lastNodeText) {
        lastNode.value = lastNodeText;
      }
      // When last part contains only the id: completely remove that node
      else {
        heading.children.pop();
      }
    } else {
      lastNode.value = parsedHeading.text;
    }
    return parsedHeading.id;
  }
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
    visit(root, 'heading', (heading) => {
      const data = heading.data ?? (heading.data = {});
      const properties = data.hProperties ?? (data.hProperties = {});

      // Gives the ability to provide/write a remark plugin that sets an id
      // When an id is already set, we use it instead of running our own plugin
      function extractAlreadyExistingId() {
        if (properties.id) {
          // Not sure why we need to slugify here, historical code
          return slugs.slug(properties.id, {maintainCase: true});
        }
        return undefined;
      }

      function extractIdFromText() {
        const headingText = getHeadingText(heading);
        return (
          extractLegacySyntaxId(heading, headingText) ??
          slugs.slug(headingText, {maintainCase: anchorsMaintainCase})
        );
      }

      // All the ways we can extract an id, ordered by priority
      // /!\ the extraction methods can perform AST cleanup side effects
      const id =
        extractAlreadyExistingId() ??
        extractCommentId(heading) ??
        extractIdFromText();

      data.id = id;
      properties.id = id;
    });
  };
};

export default plugin;
