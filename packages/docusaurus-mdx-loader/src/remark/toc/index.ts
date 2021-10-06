/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parse, ParserOptions} from '@babel/parser';
import type {Identifier} from '@babel/types';
import traverse from '@babel/traverse';
import stringifyObject from 'stringify-object';
import search from './search';
import type {Plugin, Transformer} from 'unified';
import type {Node, Parent} from 'unist';
import type {Literal} from 'mdast';

const parseOptions: ParserOptions = {
  plugins: ['jsx'],
  sourceType: 'module',
};

const isImport = (child: Node): child is Literal => child.type === 'import';
const hasImports = (index: number) => index > -1;
const isExport = (child: Node): child is Literal => child.type === 'export';

interface PluginOptions {
  name?: string;
}

const isTarget = (child: Literal, name: string) => {
  let found = false;
  const ast = parse(child.value, parseOptions);
  traverse(ast, {
    VariableDeclarator: (path) => {
      if ((path.node.id as Identifier).name === name) {
        found = true;
      }
    },
  });
  return found;
};

const getOrCreateExistingTargetIndex = (children: Node[], name: string) => {
  let importsIndex = -1;
  let targetIndex = -1;

  children.forEach((child, index) => {
    if (isImport(child)) {
      importsIndex = index;
    } else if (isExport(child) && isTarget(child, name)) {
      targetIndex = index;
    }
  });

  if (targetIndex === -1) {
    const target = {
      default: false,
      type: 'export',
      value: `export const ${name} = [];`,
    };

    targetIndex = hasImports(importsIndex) ? importsIndex + 1 : 0;
    children.splice(targetIndex, 0, target);
  }

  return targetIndex;
};

const plugin: Plugin<[PluginOptions?]> = (options = {}) => {
  const name = options.name || 'toc';

  const transformer: Transformer = (node) => {
    const headings = search(node);
    const {children} = node as Parent<Literal>;
    const targetIndex = getOrCreateExistingTargetIndex(children, name);

    if (headings && headings.length) {
      children[targetIndex].value = `export const ${name} = ${stringifyObject(
        headings,
      )};`;
    }
  };

  return transformer;
};

export default plugin;
