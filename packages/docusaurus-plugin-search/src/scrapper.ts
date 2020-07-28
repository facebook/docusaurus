/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import rehype from 'rehype';
import toText from 'hast-util-to-string';
import find from 'unist-util-find';
import visit from 'unist-util-visit';
import parent from 'unist-util-parents';
import {Node, DataNode} from './types';

export const LEVEL = {
  content: 'p',
  lv0: 'h1',
  lv1: 'h2',
  lv2: 'h3',
};

export const WIEGHT = {
  [LEVEL.content]: 3,
  [LEVEL.lv0]: 0,
  [LEVEL.lv1]: 1,
  [LEVEL.lv2]: 2,
};

const anchorTest = (node: Node) =>
  node && node.properties && (node.properties as Record<string, string>).id;

const checkAnchor = (node: Node) =>
  anchorTest(node) &&
  !(node.properties as Record<string, string>).id.startsWith('__');

const extractAnchor = (node: Node) =>
  checkAnchor(node)
    ? (node.properties as Record<string, string>).id
    : undefined;

const getAnchor = (node: Node) => {
  if (!node) {
    return node;
  }
  let anchor = node;
  if (checkAnchor(anchor)) {
    return node;
  }
  if (!checkAnchor(anchor)) {
    anchor = find(node, anchorTest);
  }
  if (!checkAnchor(anchor)) {
    for (
      let i = ((node.parent as Record<string, unknown>).children as Array<
        Node
      >).indexOf(node);
      i >= 0;
      i -= 1
    ) {
      anchor = find(
        ((node.parent as Record<string, unknown>).children as Array<Node>)[i],
        anchorTest,
      );
      if (anchor) {
        break;
      }
    }
  }
  if (!checkAnchor(anchor)) {
    anchor = getAnchor(node.parent as Node);
    return anchor;
  }
  return anchor;
};

const testLevel = (node: Node) =>
  node.tagName === LEVEL.content ||
  node.tagName === LEVEL.lv0 ||
  node.tagName === LEVEL.lv1 ||
  node.tagName === LEVEL.lv2;

export default function scrap(data: string): DataNode[] {
  const file = rehype().parse(data);
  const nodes: Array<DataNode> = [];
  visit(parent(file), testLevel as any, (node) => {
    nodes.push({
      type: node.tagName as string,
      anchor: extractAnchor(getAnchor(node as Node)),
      body: toText(node).trim().replace(/#$/m, '').trim(),
    });
  });
  return nodes;
}
