/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parse, type ParserOptions} from '@babel/parser';
import traverse from '@babel/traverse';
import stringifyObject from 'stringify-object';
import toString from 'mdast-util-to-string';
import visit from 'unist-util-visit';
import {toValue} from '../utils';

import type {Identifier} from '@babel/types';
import type {TOCItem} from '../..';
import type {Node, Parent} from 'unist';
import type {Heading, Literal} from 'mdast';
import type {Transformer} from 'unified';

const parseOptions: ParserOptions = {
  plugins: ['jsx'],
  sourceType: 'module',
};

const name = 'toc';

const isImport = (child: Node): child is Literal => child.type === 'import';
const hasImports = (index: number) => index > -1;
const isExport = (child: Node): child is Literal => child.type === 'export';

const isTarget = (child: Literal) => {
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

const getOrCreateExistingTargetIndex = (children: Node[]) => {
  let importsIndex = -1;
  let targetIndex = -1;

  children.forEach((child, index) => {
    if (isImport(child)) {
      importsIndex = index;
    } else if (isExport(child) && isTarget(child)) {
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

export default function plugin(): Transformer {
  return (root) => {
    const headings: TOCItem[] = [];

    visit(root, 'heading', (child: Heading, index, parent) => {
      const value = toString(child);

      // depth: 1 headings are titles and not included in the TOC
      if (parent !== root || !value || child.depth < 2) {
        return;
      }

      headings.push({
        value: toValue(child),
        id: child.data!.id as string,
        level: child.depth,
      });
    });
    const {children} = root as Parent<Literal>;
    const targetIndex = getOrCreateExistingTargetIndex(children);

    if (headings.length) {
      children[targetIndex]!.value = `export const ${name} = ${stringifyObject(
        headings,
      )};`;
    }
  };
}
