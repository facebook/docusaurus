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
import {transformNode} from '../utils';
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

const insertAfterLastImport = async (children: Node[], nodeToInsert: Node) => {
  const insertionIndex = children.findLastIndex(isImport) + 1;
  children.splice(insertionIndex, 0, nodeToInsert);
};

type VisitTreeResult = {
  // The toc items we collected in the tree
  tocItems: TOCItems;
  // A potential "export const toc = ..." node found in the tree
  existingTocExport: MdxjsEsm | null;
};

async function visitTree(root: Root, name: string): Promise<VisitTreeResult> {
  const {toString} = await import('mdast-util-to-string');
  const {visit} = await import('unist-util-visit');

  const partialComponentToTocSliceName = new Map<string, string>();

  const tocItems: TOCItems = [];

  let existingTocExport: MdxjsEsm | null = null;

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

  return {tocItems, existingTocExport};

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
      existingTocExport = node;
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
}

export default function plugin(options: PluginOptions = {}): Transformer<Root> {
  const name = options.name || 'toc';

  return async (root) => {
    const {tocItems, existingTocExport} = await visitTree(root, name);
    const {children} = root;

    const tocExportNode = await createTOCExportNodeAST(name, tocItems);

    // If user explicitly writes "export const toc" in his mdx file
    if (existingTocExport) {
      // We only override user declaration if at least 1 heading
      // TODO this is a suspicious legacy behavior, do we keep it?
      //  see https://github.com/facebook/docusaurus/pull/7530
      if (tocItems.length) {
        transformNode(existingTocExport, tocExportNode);
      } else {
        // Otherwise keep user toc declaration
      }
    }
    // Normal case: we add a brand new "export const toc" declaration
    else {
      // TODO why not just children.push(tocExportNode) ???
      //  that seems reasonable to always export the toc at the end
      await insertAfterLastImport(children, tocExportNode);
    }
  };
}
