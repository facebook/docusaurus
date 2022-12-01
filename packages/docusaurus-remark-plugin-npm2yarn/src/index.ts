/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import npmToYarn from 'npm-to-yarn';
import type {Code, Literal} from 'mdast';
import type {Plugin} from 'unified';
import type {Node, Parent} from 'unist';

type PluginOptions = {
  sync?: boolean;
};

// E.g. global install: 'npm i' -> 'yarn'
const convertNpmToYarn = (npmCode: string) => npmToYarn(npmCode, 'yarn');

const transformNode = (node: Code, isSync: boolean) => {
  const groupIdProp = isSync
    ? {
        type: 'mdxJsxAttribute',
        name: 'groupId',
        value: 'npm2yarn',
      }
    : undefined;

  const npmCode = node.value;
  const yarnCode = convertNpmToYarn(node.value);
  return [
    {
      type: 'mdxJsxFlowElement',
      name: 'Tabs',
      attributes: [groupIdProp].filter(Boolean),
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'TabItem',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'value',
              value: 'npm',
            },
          ],
          children: [
            {
              type: node.type,
              lang: node.lang,
              value: npmCode,
            },
          ],
        },

        {
          type: 'mdxJsxFlowElement',
          name: 'TabItem',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'value',
              value: 'yarn',
            },
            {
              type: 'mdxJsxAttribute',
              name: 'label',
              value: 'Yarn',
            },
          ],
          children: [
            {
              type: node.type,
              lang: node.lang,
              value: yarnCode,
            },
          ],
        },
      ],
    },
  ] as any[];
};

const isMdxEsmLiteral = (node: Node): node is Literal =>
  node.type === 'mdxjsEsm';
// TODO legacy approximation, good-enough for now but not 100% accurate
const isTabsImport = (node: Node): boolean =>
  isMdxEsmLiteral(node) && node.value.includes('@theme/Tabs');

const isParent = (node: Node): node is Parent =>
  Array.isArray((node as Parent).children);
const isNpm2Yarn = (node: Node): node is Code =>
  node.type === 'code' && (node as Code).meta === 'npm2yarn';

function createImportNode() {
  return {
    type: 'mdxjsEsm',
    value:
      "import Tabs from '@theme/Tabs'\nimport TabItem from '@theme/TabItem'",
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {type: 'Identifier', name: 'Tabs'},
              },
            ],
            source: {
              type: 'Literal',
              value: '@theme/Tabs',
              raw: "'@theme/Tabs'",
            },
          },
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {type: 'Identifier', name: 'TabItem'},
              },
            ],
            source: {
              type: 'Literal',
              value: '@theme/TabItem',
              raw: "'@theme/TabItem'",
            },
          },
        ],
        sourceType: 'module',
      },
    },
  };
}

const plugin: Plugin<[PluginOptions?]> = (options = {}) => {
  const {sync = false} = options;
  return (root, p) => {
    let transformed = false as boolean;
    let alreadyImported = false as boolean;

    visit(root, (node: Node) => {
      if (isTabsImport(node)) {
        alreadyImported = true;
      }

      if (isParent(node)) {
        let index = 0;
        while (index < node.children.length) {
          const child = node.children[index]!;
          if (isNpm2Yarn(child)) {
            const result = transformNode(child, sync);
            node.children.splice(index, 1, ...result);
            index += result.length;
            transformed = true;
          } else {
            index += 1;
          }
        }
      }
    });

    if (transformed && !alreadyImported) {
      (root as Parent).children.unshift(createImportNode());
    }
  };
};

// To continue supporting `require('npm2yarn')` without the `.default` ㄟ(▔,▔)ㄏ
// TODO change to export default after migrating to ESM
export = plugin;
