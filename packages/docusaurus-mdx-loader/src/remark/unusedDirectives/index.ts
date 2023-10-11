/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import visit from 'unist-util-visit';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Processor, Parent} from 'unified';

import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-directive';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

const plugin: Plugin = function plugin(this: Processor): Transformer {
  return (root) => {
    const unusedDirectives: Array<{
      name: string;
      type: string;
    }> = [];
    const directiveTypes = [
      'containerDirective',
      'leafDirective',
      'textDirective',
    ];

    const directiveVisitor = (
      node: ContainerDirective | LeafDirective | TextDirective,
    ) => {
      if (directiveTypes.includes(node.type)) {
        unusedDirectives.push({
          name: node.name,
          type: node.type,
          // start: node.position.start.line,
          // path: ` ${filePath}:${node.position.start.line}:${node.position.start.column}`,
        });
      }
    };

    // const directiveVisitor = (
    //   node: ContainerDirective | LeafDirective | TextDirective,
    // ) => {
    //   // Convert the directive to plain text and add it to the
    //   // unusedDirectives array

    //   unusedDirectives.push(directiveText);

    //   // Remove the directive from the tree
    //   if (parent) {
    //     const index = parent.children.indexOf(node);
    //     if (index !== -1) {
    //       parent.children.splice(index, 1);
    //     }
    //   }
    // };

    visit<Parent>(root, 'containerDirective', directiveVisitor);
    visit<Parent>(root, 'leafDirective', directiveVisitor);
    visit<Parent>(root, 'textDirective', directiveVisitor);

    console.log('Unused Directives:', unusedDirectives);
  };
};

export default plugin;
