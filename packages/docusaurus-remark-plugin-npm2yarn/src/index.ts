/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit from 'unist-util-visit';
import npmToYarn from 'npm-to-yarn';
import type {Code, Content, Literal} from 'mdast';
import type {Plugin} from 'unified';
import type {Node, Parent} from 'unist';

type CustomConverter = [name: string, cb: (npmCode: string) => string];

type PluginOptions = {
  sync?: boolean;
  converters?: (CustomConverter | 'yarn' | 'pnpm')[];
};

function createTabItem(
  code: string,
  node: Code,
  value: string,
  label?: string,
) {
  return [
    {
      type: 'jsx',
      value: `<TabItem value="${value}"${label ? ` label="${label}"` : ''}>`,
    },
    {
      type: node.type,
      lang: node.lang,
      value: code,
    },
    {
      type: 'jsx',
      value: '</TabItem>',
    },
  ] as Content[];
}

const transformNode = (
  node: Code,
  isSync: boolean,
  converters: (CustomConverter | 'yarn' | 'pnpm')[],
) => {
  const groupIdProp = isSync ? ' groupId="npm2yarn"' : '';
  const npmCode = node.value;
  return [
    {
      type: 'jsx',
      value: `<Tabs${groupIdProp}>`,
    },
    ...createTabItem(npmCode, node, 'npm'),
    ...converters.flatMap((converter) =>
      typeof converter === 'string'
        ? createTabItem(
            npmToYarn(npmCode, converter),
            node,
            converter,
            converter === 'yarn' ? 'Yarn' : converter,
          )
        : createTabItem(converter[1](npmCode), node, converter[0]),
    ),
    {
      type: 'jsx',
      value: '</Tabs>',
    },
  ] as Content[];
};

const isImport = (node: Node): node is Literal => node.type === 'import';
const isParent = (node: Node): node is Parent =>
  Array.isArray((node as Parent).children);
const matchNode = (node: Node): node is Code =>
  node.type === 'code' && (node as Code).meta === 'npm2yarn';
const nodeForImport: Literal = {
  type: 'import',
  value:
    "import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';",
};

const plugin: Plugin<[PluginOptions?]> = (options = {}) => {
  const {sync = false, converters = ['yarn', 'pnpm']} = options;
  return (root) => {
    let transformed = false as boolean;
    let alreadyImported = false as boolean;
    visit(root, (node: Node) => {
      if (isImport(node) && node.value.includes('@theme/Tabs')) {
        alreadyImported = true;
      }
      if (isParent(node)) {
        let index = 0;
        while (index < node.children.length) {
          const child = node.children[index]!;
          if (matchNode(child)) {
            const result = transformNode(child, sync, converters);
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
      (root as Parent).children.unshift(nodeForImport);
    }
  };
};

// To continue supporting `require('npm2yarn')` without the `.default` ㄟ(▔,▔)ㄏ
// TODO change to export default after migrating to ESM
export = plugin;
