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
import type {Heading, Literal, Text} from 'mdast';
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

const removeTags = (input: string) =>
  input.replace('<', '').replace('/>', '').trim();

export default function plugin(): Transformer {
  return (root) => {
    const headings: (TOCItem | string)[] = [];

    const PartialComponentToHeadingsName = Object.create(null);

    visit(
      root,
      ['heading', 'jsx', 'import', 'export'],
      (child, index, parent) => {
        if (child.type === 'heading') {
          const headingNode = child as Heading;
          const value = toString(headingNode);

          // depth: 1 headings are titles and not included in the TOC
          if (parent !== root || !value || headingNode.depth < 2) {
            return;
          }

          headings.push({
            value: toValue(headingNode),
            id: headingNode.data!.id as string,
            level: headingNode.depth,
          });
        }

        if (child.type === 'import') {
          const importNode = child as Text;

          const markdownExtensionRegex = /\.(?:mdx|md).$/;
          const imports = importNode.value
            .split('\n')
            .filter((statement) => markdownExtensionRegex.test(statement));
          for (let i = 0; i < imports.length; i += 1) {
            const localName = `${name}${i}`;

            const importWords = imports[i]!.split(' ');
            const partialPath = importWords[importWords.length - 1];
            const partialName = importWords[1] as string;
            const tocImport = `import {${name} as ${localName}} from ${partialPath}`;

            PartialComponentToHeadingsName[partialName] = localName;

            importNode.value = `${importNode.value}\n${tocImport}`;
          }
        }

        if (child.type === 'jsx') {
          const jsxNode = child as Text;

          const componentName = removeTags(jsxNode.value);
          const headingsName = PartialComponentToHeadingsName[componentName];
          if (headingsName) {
            headings.push(`...${headingsName}`);
          }
        }

        if (child.type === 'export') {
          const exportNode = child as Text;

          if (exportNode.value.includes(name)) {
            exportNode.value = '';
          }
        }
      },
    );
    const {children} = root as Parent<Literal>;
    const targetIndex = getOrCreateExistingTargetIndex(children);

    if (headings.length) {
      let headingsArray = '[';
      for (const heading of headings) {
        if (typeof heading === 'string') {
          headingsArray = `${headingsArray}\n${heading},`;
        } else {
          headingsArray = `${headingsArray}\n${stringifyObject(heading)},`;
        }
      }
      headingsArray += ']';

      children[targetIndex]!.value = `export const ${name} = ${headingsArray};`;
    }
  };
}
