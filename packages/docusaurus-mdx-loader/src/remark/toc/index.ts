/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parse, type ParserOptions} from '@babel/parser';
import traverse from '@babel/traverse';
import stringifyObject from 'stringify-object';
import {toValue} from '../utils';
import type {Identifier} from '@babel/types';
import type {Node, Parent} from 'unist';
import type {Heading, Literal} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {
  MdxjsEsm,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-mdx';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// TODO upgrade to TS 5.3
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

export type TOCItem = {
  readonly value: string;
  readonly id: string;
  readonly level: number;
};

const parseOptions: ParserOptions = {
  plugins: ['jsx'],
  sourceType: 'module',
};

const isImport = (child: any): child is Literal =>
  child.type === 'mdxjsEsm' && child.value.startsWith('import');
const hasImports = (index: number) => index > -1;
const isExport = (child: any): child is Literal =>
  child.type === 'mdxjsEsm' && child.value.startsWith('export');

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
    const target = await createExportNode(name, []);

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

    const headings: TOCItem[] = [];

    visit(root, 'heading', (child: Heading) => {
      const value = toString(child);

      // depth:1 headings are titles and not included in the TOC
      if (!value || child.depth < 2) {
        return;
      }

      headings.push({
        value: toValue(child, toString),
        id: child.data!.id!,
        level: child.depth,
      });
    });

    const {children} = root as Parent;
    const targetIndex = await getOrCreateExistingTargetIndex(children, name);

    if (headings?.length) {
      children[targetIndex] = await createExportNode(name, headings);
    }
  };
};

export default plugin;

async function createExportNode(name: string, object: any): Promise<MdxjsEsm> {
  const {valueToEstree} = await import('estree-util-value-to-estree');

  return {
    type: 'mdxjsEsm',
    value: `export const ${name} = ${stringifyObject(object)}`,
    data: {
      estree: {
        type: 'Program',
        body: [
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
                  init: valueToEstree(object),
                },
              ],
              kind: 'const',
            },
            specifiers: [],
            source: null,
          },
        ],
        sourceType: 'module',
      },
    },
  };
}
