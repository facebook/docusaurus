/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  addTocSliceImportIfNeeded,
  createTOCExportNodeAST,
  findDefaultImportName,
  getImportDeclarations,
  isMarkdownImport,
  isNamedExport,
} from './utils';
import type {Heading, Root} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Plugin, Transformer} from 'unified';
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

// ComponentName (default export) => ImportDeclaration mapping
type MarkdownImports = Map<string, {declaration: ImportDeclaration}>;

// MdxjsEsm node representing an already existing "export const toc" declaration
type ExistingTOCExport = MdxjsEsm | null;

function createTocSliceImportName({
  tocExportName,
  componentName,
}: {
  tocExportName: string;
  componentName: string;
}) {
  // The name of the toc slice import alias doesn't matter much
  // We just need to ensure it's valid and won't conflict with other names
  return `__${tocExportName}${componentName}`;
}

async function collectImportsExports({
  root,
  tocExportName,
}: {
  root: Root;
  tocExportName: string;
}): Promise<{
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
    if (isNamedExport(node, tocExportName)) {
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

async function collectTOCItems({
  root,
  tocExportName,
  markdownImports,
}: {
  root: Root;
  tocExportName: string;
  markdownImports: MarkdownImports;
}): Promise<{
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
      visitJSXElement(child);
    }
  });

  return {tocItems};

  // Visit Markdown headings
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

  // Visit JSX elements, such as <Partial/>
  function visitJSXElement(node: MdxJsxFlowElement) {
    const componentName = node.name;
    if (!componentName) {
      return;
    }
    const importDeclaration = markdownImports.get(componentName)?.declaration;
    if (!importDeclaration) {
      return;
    }

    const tocSliceImportName = createTocSliceImportName({
      tocExportName,
      componentName,
    });

    tocItems.push({
      type: 'slice',
      importName: tocSliceImportName,
    });

    addTocSliceImportIfNeeded({
      importDeclaration,
      tocExportName,
      tocSliceImportName,
    });
  }
}

const plugin: Plugin<PluginOptions[], Root> = function plugin(
  options = {},
): Transformer<Root> {
  const tocExportName = options.name || 'toc';

  return async (root) => {
    const {markdownImports, existingTocExport} = await collectImportsExports({
      root,
      tocExportName,
    });

    // If user explicitly writes "export const toc" in his mdx file
    // We keep it as is do not override their explicit toc structure
    // See https://github.com/facebook/docusaurus/pull/7530#discussion_r1458087876
    if (existingTocExport) {
      return;
    }

    const {tocItems} = await collectTOCItems({
      root,
      tocExportName,
      markdownImports,
    });

    root.children.push(
      await createTOCExportNodeAST({
        tocExportName,
        tocItems,
      }),
    );
  };
};

export default plugin;
