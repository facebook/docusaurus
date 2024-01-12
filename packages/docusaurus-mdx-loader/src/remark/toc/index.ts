/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parse, type ParserOptions} from '@babel/parser';
import traverse from '@babel/traverse';
import {generate} from 'astring';
import {toValue} from '../utils';
import {hasImports, isExport, isImport} from './utils';
import type {TOCItem, NestedTOC} from './utils';
import type {
  SpreadElement,
  Program,
  ImportDeclaration,
  ImportSpecifier,
} from 'estree';
import type {Identifier} from '@babel/types';
import type {Node, Parent} from 'unist';
import type {Heading, Literal} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {
  MdxjsEsm,
  MdxJsxFlowElement,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-mdx';

// Reexport TOCItem, since it's used throughout the project
export type {TOCItem} from './utils';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// TODO upgrade to TS 5.3
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any;

const parseOptions: ParserOptions = {
  plugins: ['jsx'],
  sourceType: 'module',
};

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

const getOrCreateExistingTargetIndex = async (
  children: Node[],
  name: string,
) => {
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
    const target = await createExportNode(name, [], []);

    targetIndex = hasImports(importsIndex) ? importsIndex + 1 : 0;
    children.splice(targetIndex, 0, target);
  }

  return targetIndex;
};

const plugin: Plugin = function plugin(
  options: PluginOptions = {},
): Transformer {
  const name = options.name || 'toc';

  return async (root) => {
    const {toString} = await import('mdast-util-to-string');
    const {visit} = await import('unist-util-visit');

    const partialComponentToHeadingsName: {[key: string]: string} =
      Object.create(null);

    const headings: (TOCItem | NestedTOC)[] = [];
    const imports: ImportDeclaration[] = [];

    function visitHeading(node: Heading) {
      const value = toString(node);

      // depth:1 headings are titles and not included in the TOC
      if (!value || node.depth < 2) {
        return;
      }

      headings.push({
        value: toValue(node, toString),
        id: node.data!.id!,
        level: node.depth,
      });
    }

    function visitMdxjsEsm(node: MdxjsEsm) {
      if (!node.data?.estree) {
        return;
      }

      for (const potentialImportDeclaration of node.data.estree.body) {
        if (potentialImportDeclaration.type !== 'ImportDeclaration') {
          continue;
        }

        const importPath = potentialImportDeclaration.source.value as string;
        const isMdxImport = /\.mdx?$/.test(importPath);
        if (!isMdxImport) {
          continue;
        }

        const componentName = potentialImportDeclaration.specifiers.find(
          (o: Node) => o.type === 'ImportDefaultSpecifier',
        )?.local.name;

        if (!componentName) {
          continue;
        }
        const {length} = Object.keys(partialComponentToHeadingsName);
        const exportAsName = `${name}${length}`;
        partialComponentToHeadingsName[componentName] = exportAsName;

        const specifier: ImportSpecifier = {
          type: 'ImportSpecifier',
          imported: {type: 'Identifier', name},
          local: {type: 'Identifier', name: exportAsName},
        };

        imports.push({
          type: 'ImportDeclaration',
          specifiers: [specifier],
          source: potentialImportDeclaration.source,
        });
        potentialImportDeclaration.specifiers.push(specifier);
      }
    }

    function visitMdxJsxFlowElement(node: MdxJsxFlowElement) {
      const nodeName = node.name;
      if (!nodeName) {
        return;
      }
      const headingsName = partialComponentToHeadingsName[nodeName];
      if (headingsName) {
        headings.push({
          nested: true,
          name: headingsName,
        });
      }
    }

    visit(root, ['heading', 'mdxjsEsm', 'mdxJsxFlowElement'], (child) => {
      if (child.type === 'heading') {
        visitHeading(child as Heading);
      } else if (child.type === 'mdxjsEsm') {
        visitMdxjsEsm(child as MdxjsEsm);
      } else if (child.type === 'mdxJsxFlowElement') {
        visitMdxJsxFlowElement(child as MdxJsxFlowElement);
      }
    });

    const {children} = root as Parent;
    const targetIndex = await getOrCreateExistingTargetIndex(children, name);

    if (headings?.length) {
      children[targetIndex] = await createExportNode(name, headings, imports);
    }
  };
};

export default plugin;

async function createExportNode(
  name: string,
  headings: (TOCItem | NestedTOC)[],
  imports: ImportDeclaration[],
): Promise<MdxjsEsm> {
  const {valueToEstree} = await import('estree-util-value-to-estree');

  const tocObject = headings.map((heading) => {
    if ('nested' in heading) {
      const spreadElement: SpreadElement = {
        type: 'SpreadElement',
        argument: {type: 'Identifier', name: heading.name},
      };
      return spreadElement;
    }

    return valueToEstree(heading);
  });

  const estree: Program = {
    type: 'Program',
    body: [
      ...imports,
      {
        type: 'ExportNamedDeclaration',
        declaration: {
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: {
                type: 'Identifier',
                name,
              },
              init: {
                type: 'ArrayExpression',
                elements: tocObject,
              },
            },
          ],
          kind: 'const',
        },
        specifiers: [],
        source: null,
      },
    ],
    sourceType: 'module',
  };

  return {
    type: 'mdxjsEsm',
    value: generate(estree),
    data: {
      estree,
    },
  };
}
