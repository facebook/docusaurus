/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Code, Content, Import, Parent, Root} from 'mdast';
import type {Plugin} from 'unified';
import npmToYarn from 'npm-to-yarn';

interface Options {
  sync?: boolean;
}

// E.g. global install: 'npm i' -> 'yarn'
const convertNpmToYarn = (npmCode: string) => npmToYarn(npmCode, 'yarn');

const transformNode = (node: Code, isSync: boolean): Content[] => {
  const groupIdProp = isSync ? 'groupId="npm2yarn" ' : '';
  const npmCode = node.value;
  const yarnCode = convertNpmToYarn(node.value);
  return [
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
  ];
};

type Node = Content | Root;

const matchNode = (node: Node): node is Code =>
  node.type === 'code' && (node as Code).meta === 'npm2yarn';
const nodeForImport: Import = {
  type: 'import',
  value:
    "import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';",
};

const attacher: Plugin<[Options], Node, Content[]> = (
  options: Options = {},
) => {
  const {sync = false} = options;
  let transformed = false;
  let alreadyImported = false;
  const transformer = (node: Node) => {
    if (
      node.type === 'import' &&
      (node as Import).value.includes('@theme/Tabs')
    ) {
      alreadyImported = true;
      return undefined;
    }
    if (matchNode(node)) {
      transformed = true;
      return transformNode(node, sync);
    }
    if (Array.isArray((node as Parent).children)) {
      let index = 0;
      while (index < (node as Parent).children.length) {
        const result = transformer((node as Parent).children[index]);
        if (result) {
          (node as Parent).children.splice(index, 1, ...result);
          index += result.length;
        } else {
          index += 1;
        }
      }
    }
    if (node.type === 'root' && transformed && !alreadyImported) {
      (node as Root).children.unshift(nodeForImport);
    }
    return undefined;
  };
  return transformer;
};

module.exports = attacher;
