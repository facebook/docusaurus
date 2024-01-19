/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createTOCExportNodeAST,
  findDefaultImportName,
  findNamedImportSpecifier,
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

// ComponentName (default export) => ImportDeclaration mapping
type MarkdownImports = Map<string, {declaration: ImportDeclaration}>;

// MdxjsEsm node representing an already existing "export const toc" declaration
type ExistingTOCExport = MdxjsEsm | null;

function createTocSliceImportName({
  name,
  componentName,
}: {
  name: string;
  componentName: string;
}) {
  return `__${name}${componentName}`;
}

async function collectImportsExports(
  root: Root,
  name: string,
): Promise<{
  markdownImports: MarkdownImports;
  existingTocExport: ExistingTOCExport;
}> {
  const {visit} = await import('unist-util-visit');

  const markdownImports = new Map<string, {declaration: ImportDeclaration}>();
  let existingTocExport: MdxjsEsm | null = null;

  visit(root, 'mdxjsEsm', (node) => {
    if (!node.data?.estree) {
      return;
    }
    if (isNamedExport(node, name)) {
      existingTocExport = node;
    }

    getImportDeclarations(node.data.estree).forEach((declaration) => {
      if (!isMarkdownImport(declaration)) {
        return;
      }
      const componentName = findDefaultImportName(declaration);
      if (!componentName) {
        return;
      }
      markdownImports.set(componentName, {
        declaration,
      });
    });
  });

  return {markdownImports, existingTocExport};
}

async function collectTOCItems(
  root: Root,
  name: string,
  markdownImports: MarkdownImports,
): Promise<{
  // The toc items we collected in the tree
  tocItems: TOCItems;
}> {
  const {toString} = await import('mdast-util-to-string');
  const {visit} = await import('unist-util-visit');

  const tocItems: TOCItems = [];

  visit(root, (child) => {
    if (child.type === 'heading') {
      visitHeading(child);
    } else if (child.type === 'mdxJsxFlowElement') {
      visitMdxJsxFlowElement(child);
    }
  });

  return {tocItems};

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

  function visitMdxJsxFlowElement(node: MdxJsxFlowElement) {
    const componentName = node.name;
    if (!componentName) {
      return;
    }
    const declaration = markdownImports.get(componentName)?.declaration;
    if (!declaration) {
      return;
    }

    const tocSliceImportName = createTocSliceImportName({name, componentName});

    // We only add the toc slice named import if it doesn't exist already
    if (!findNamedImportSpecifier(declaration, tocSliceImportName)) {
      declaration.specifiers.push({
        type: 'ImportSpecifier',
        imported: {type: 'Identifier', name},
        local: {type: 'Identifier', name: tocSliceImportName},
      });
    }

    tocItems.push({
      type: 'slice',
      name: tocSliceImportName,
    });
  }
}

export default function plugin(options: PluginOptions = {}): Transformer<Root> {
  const name = options.name || 'toc';

  return async (root) => {
    const {markdownImports, existingTocExport} = await collectImportsExports(
      root,
      name,
    );

    const {tocItems} = await collectTOCItems(root, name, markdownImports);

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
      await insertAfterLastImport(root.children, tocExportNode);
    }
  };
}
