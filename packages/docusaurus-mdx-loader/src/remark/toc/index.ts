/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parse, type ParserOptions} from '@babel/parser';
import traverse from '@babel/traverse';
import {
  createTOCExportNode,
  findDefaultImportName,
  getImportDeclarations,
  hasImports,
  isExport,
  isImport,
  isMarkdownImport,
} from './utils';
import type {Identifier} from '@babel/types';
import type {Node} from 'unist';
import type {Heading, Literal, Root} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {
  MdxjsEsm,
  MdxJsxFlowElement,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-mdx';
import type {TOCItems} from './types';
import type {ImportDeclaration} from 'estree';

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
    const target = await createTOCExportNode(name, []);

    targetIndex = hasImports(importsIndex) ? importsIndex + 1 : 0;
    children.splice(targetIndex, 0, target);
  }

  return targetIndex;
};

const plugin = function plugin(options: PluginOptions = {}): Transformer<Root> {
  const name = options.name || 'toc';

  return async (root) => {
    const {toString} = await import('mdast-util-to-string');
    const {visit} = await import('unist-util-visit');

    const partialComponentToTocSliceName = new Map<string, string>();

    const tocItems: TOCItems = [];

    function visitHeading(node: Heading) {
      const value = toString(node);

      // depth:1 headings are titles and not included in the TOC
      if (!value || node.depth < 2) {
        return;
      }

      tocItems.push({
        type: 'heading',
        heading: node,
      });
    }

    function visitMdxjsEsm(node: MdxjsEsm) {
      if (!node.data?.estree) {
        return;
      }

      // Before: import X from 'x.mdx'
      // After: import X, {toc as __toc42} from 'x.mdx'
      function addTOCNamedImport(
        importDeclaration: ImportDeclaration,
        componentName: string,
      ) {
        const {size} = partialComponentToTocSliceName;
        const exportAsName = `__${name}${size}`;
        partialComponentToTocSliceName.set(componentName, exportAsName);
        importDeclaration.specifiers.push({
          type: 'ImportSpecifier',
          imported: {type: 'Identifier', name},
          local: {type: 'Identifier', name: exportAsName},
        });
      }

      getImportDeclarations(node.data.estree).forEach((importDeclaration) => {
        if (!isMarkdownImport(importDeclaration)) {
          return;
        }
        const componentName = findDefaultImportName(importDeclaration);
        if (!componentName) {
          return;
        }
        addTOCNamedImport(importDeclaration, componentName);
      });
    }

    function visitMdxJsxFlowElement(node: MdxJsxFlowElement) {
      const nodeName = node.name;
      if (!nodeName) {
        return;
      }
      const tocSliceName = partialComponentToTocSliceName.get(nodeName);
      if (tocSliceName) {
        tocItems.push({
          type: 'slice',
          name: tocSliceName,
        });
      }
    }

    visit(root, (child) => {
      if (child.type === 'heading') {
        visitHeading(child);
      } else if (child.type === 'mdxjsEsm') {
        visitMdxjsEsm(child);
      } else if (child.type === 'mdxJsxFlowElement') {
        visitMdxJsxFlowElement(child);
      }
    });

    const {children} = root;
    const targetIndex = await getOrCreateExistingTargetIndex(children, name);

    if (tocItems?.length) {
      children[targetIndex] = await createTOCExportNode(name, tocItems);
    }
  };
};

export default plugin;
