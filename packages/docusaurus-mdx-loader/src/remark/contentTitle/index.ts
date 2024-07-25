/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {Heading, Parent} from 'mdast';

// @ts-expect-error: ES support...
import type {MdxJsxFlowElement} from 'mdast-util-mdx';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// TODO upgrade to TS 5.3
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

interface PluginOptions {
  removeContentTitle?: boolean;
}

function wrapHeadingInJsxHeader(
  headingNode: Heading,
  parent: Parent,
  index: number,
) {
  const header: MdxJsxFlowElement = {
    type: 'mdxJsxFlowElement',
    name: 'header',
    attributes: [],
    children: [headingNode],
  };
  parent.children[index] = header;
}

/**
 * A remark plugin to extract the h1 heading found in Markdown files
 * This is exposed as "data.contentTitle" to the processed vfile
 * Also gives the ability to strip that content title (used for the blog plugin)
 */
const plugin: Plugin = function plugin(
  options: PluginOptions = {},
): Transformer {
  // content title is
  const removeContentTitle = options.removeContentTitle ?? false;

  return async (root, vfile) => {
    const {toString} = await import('mdast-util-to-string');
    const {visit, EXIT} = await import('unist-util-visit');
    visit(root, ['heading', 'thematicBreak'], (node, index, parent) => {
      if (node.type === 'heading') {
        const headingNode = node as Heading;
        // console.log('headingNode:', headingNode);

        if (headingNode.depth === 1) {
          vfile.data.contentTitle = toString(headingNode);
          if (removeContentTitle) {
            // @ts-expect-error: TODO how to fix?
            parent!.children.splice(index, 1);
          } else {
            // TODO in the future it might be better to export contentTitle as
            // as JSX node to keep this logic a theme concern?
            // See https://github.com/facebook/docusaurus/pull/10335#issuecomment-2250187371
            wrapHeadingInJsxHeader(headingNode, parent, index!);
          }
          return EXIT; // We only handle the very first heading
        }
        // We only handle contentTitle if it's the very first heading found
        if (headingNode.depth >= 1) {
          return EXIT;
        }
      }
      // We only handle contentTitle when it's above the first thematic break
      if (node.type === 'thematicBreak') {
        return EXIT;
      }
      return undefined;
    });
  };
};

export default plugin;
