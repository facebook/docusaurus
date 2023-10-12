/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import visit from 'unist-util-visit';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer, Processor, Parent} from 'unified';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

const plugin: Plugin = function plugin(this: Processor): Transformer {
  return (tree) => {
    const unusedDirectives: Array<{
      name: string | null;
      type: string;
    }> = [];
    const directiveTypes = [
      'containerDirective',
      'leafDirective',
      'textDirective',
    ];

    const directiveVisitor = (node: any) => {
      if (directiveTypes.includes(node.type)) {
        unusedDirectives.push({
          name: node.name,
          type: node.type,
          // start: node.position.start.line,
          // path: ` ${filePath}:${node.position.start.line}:${node.position.start.column}`,
        });

        if (node.children) {
          node.children.forEach((child: any) => directiveVisitor(child));
        }
      }
    };

    visit<Parent>(tree, 'root', directiveVisitor);

    if (unusedDirectives.length > 0) {
      console.warn('unusedDirectives', unusedDirectives);
    }
  };
};

export default plugin;
