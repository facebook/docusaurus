/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Code, Content, Literal} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import type {Node, Parent} from 'unist';
import visit from 'unist-util-visit';
import npmToYarn from 'npm-to-yarn';

interface PluginOptions {
  sync?: boolean;
}

// E.g. global install: 'npm i' -> 'yarn'
const convertNpmToYarn = (npmCode: string) => npmToYarn(npmCode, 'yarn');

const transformNode = (node: Code, isSync: boolean) => {
  const groupIdProp = isSync ? ' groupId="npm2yarn"' : '';
  const npmCode = node.value;
  const yarnCode = convertNpmToYarn(node.value);
  return [
    {
      type: 'jsx',
      value: `<Tabs${groupIdProp}>\n<TabItem value="npm">`,
    },
    {
      type: node.type,
      lang: node.lang,
      value: npmCode,
    },
    {
      type: 'jsx',
      value: '</TabItem>\n<TabItem value="yarn" label="Yarn">',
    },
    {
      type: node.type,
      lang: node.lang,
      value: yarnCode,
    },
    {
      type: 'jsx',
      value: '</TabItem>\n</Tabs>',
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
  const {sync = false} = options;
  let transformed = false;
  let alreadyImported = false;
  const transformer: Transformer = (root) => {
    visit(root, (node: Node) => {
      if (isImport(node) && node.value.includes('@theme/Tabs')) {
        alreadyImported = true;
      }
      if (isParent(node)) {
        let index = 0;
        while (index < node.children.length) {
          const child = node.children[index];
          if (matchNode(child)) {
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
      (root as Parent).children.unshift(nodeForImport);
    }
  };
  return transformer;
};

// To continue supporting `require('npm2yarn')` without the `.default` ㄟ(▔,▔)ㄏ
// TODO change to export default after migrating to ESM
export = plugin;
