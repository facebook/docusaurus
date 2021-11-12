/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Code, Content, Literal} from 'mdast';
import type {Plugin, Transformer} from 'unified';
import type {Node, Parent} from 'unist';
import npmToYarn from 'npm-to-yarn';

interface PluginOptions {
  sync?: boolean;
}

// E.g. global install: 'npm i' -> 'yarn'
const convertNpmToYarn = (npmCode: string) => npmToYarn(npmCode, 'yarn');

const transformNode = (node: Code, isSync: boolean): Parent => {
  const groupIdProp = isSync ? 'groupId="npm2yarn" ' : '';
  const npmCode = node.value;
  const yarnCode = convertNpmToYarn(node.value);
  return {
    type: '',
    children: [
      {
        type: 'jsx',
        value:
          `<Tabs defaultValue="npm" ${groupIdProp}` +
          `values={[
    { label: 'npm', value: 'npm', },
    { label: 'Yarn', value: 'yarn', },
  ]}
>
<TabItem value="npm">`,
      },
      {
        type: node.type,
        lang: node.lang,
        value: npmCode,
      },
      {
        type: 'jsx',
        value: '</TabItem>\n<TabItem value="yarn">',
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
    ] as Content[],
  };
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

const attacher: Plugin<[PluginOptions?]> = (options = {}) => {
  const {sync = false} = options;
  let transformed = false;
  let alreadyImported = false;
  const transformer: Transformer = (node, _) => {
    if (isImport(node) && node.value.includes('@theme/Tabs')) {
      alreadyImported = true;
      return undefined;
    }
    if (matchNode(node)) {
      transformed = true;
      return transformNode(node, sync);
    }
    if (isParent(node)) {
      let index = 0;
      while (index < node.children.length) {
        const {children: result} =
          (transformer(node.children[index], _) as Parent) ?? {};
        if (result) {
          node.children.splice(index, 1, ...result);
          index += result.length;
        } else {
          index += 1;
        }
      }
    }
    if (node.type === 'root' && transformed && !alreadyImported) {
      (node as Parent).children.unshift(nodeForImport);
    }
    return undefined;
  };
  return transformer;
};

module.exports = attacher;
