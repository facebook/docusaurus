/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createTOCExportNodeAST,
  findDefaultImportName,
  getImportDeclarations,
  isImport,
  isMarkdownImport,
  isNamedExport,
} from './utils';
import type {Node} from 'unist';
import type {Heading, Root} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {
  MdxjsEsm,
  MdxJsxFlowElement,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-mdx';
import type {TOCItems} from './types';
import type {ImportDeclaration} from 'estree';

interface PluginOptions {
  name?: string;
}

const getOrCreateExistingTargetIndex = async (
  children: Node[],
  name: string,
) => {
  let importsIndex = -1;
  let targetIndex = -1;

  children.forEach((node, index) => {
    if (isImport(node)) {
      importsIndex = index;
    } else if (isNamedExport(node, name)) {
      targetIndex = index;
    }
  });

  if (targetIndex === -1) {
    const target = await createTOCExportNodeAST(name, []);
    const hasImports = importsIndex > -1;
    targetIndex = hasImports ? importsIndex + 1 : 0;
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

    // let tocExportAlreadyExists = false;

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

      if (isNamedExport(node, name)) {
        // tocExportAlreadyExists = true;
        // return;
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

      getImportDeclarations(node.data.estree).forEach((declaration) => {
        if (!isMarkdownImport(declaration)) {
          return;
        }
        const componentName = findDefaultImportName(declaration);
        if (!componentName) {
          return;
        }
        addTOCNamedImport(declaration, componentName);
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
      /*
      if (tocExportAlreadyExists) {
        return;
      }
      */

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

    if (tocItems.length) {
      children[targetIndex] = await createTOCExportNodeAST(name, tocItems);
    }
  };
};

export default plugin;
