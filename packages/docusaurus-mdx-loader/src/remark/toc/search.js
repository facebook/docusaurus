/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');
const {toValue} = require('../utils');

/** @typedef {import('@docusaurus/types').TOCItem} TOC */
/** @typedef {import('unist').Node} Node */

/**
 * @typedef {Object} StringValuedNode
 * @property {string} type
 * @property {string} value
 * @property {number} depth
 * @property {Object} data
 * @property {StringValuedNode[]} children
 */

/**
 * @param {StringValuedNode} headingNode
 * @param {Number} maxDepth
 * @returns {TOC[]}
 */
function search(headingNode, maxDepth) {
  const headings = [];

  /**
   * @param {StringValuedNode} child
   * @param {number} index
   * @param {Node | undefined} parent
   * @returns {void}
   */
  const onHeading = (child, index, parent) => {
    const value = toString(child);

    if (
      parent !== headingNode ||
      !value ||
      child.depth > maxDepth ||
      child.depth < 2
    ) {
      return;
    }

    headings.push({
      value: toValue(child),
      id: child.data.id,
      children: [],
      // Temporary properties
      level: child.depth,
      parentIndex: -1,
    });
  };

  visit(headingNode, 'heading', onHeading);

  const findParent = (toc, parentIndex, level) => {
    while (parentIndex >= 0 && level < toc[parentIndex].level) {
      parentIndex = toc[parentIndex].parentIndex;
    }
    return parentIndex >= 0 ? toc[parentIndex].parentIndex : -1;
  };

  headings.forEach((node, index) => {
    const prev = headings[index > 0 ? index - 1 : 0];
    node.parentIndex =
      node.level > prev.level
        ? (node.parentIndex = index - 1)
        : prev.parentIndex;
    node.parentIndex =
      node.level < prev.level
        ? findParent(headings, node.parentIndex, node.level)
        : node.parentIndex;
  });

  const rootNodeIds = [];
  headings.forEach((node, i) => {
    if (node.parentIndex >= 0) {
      rootNodeIds.push(i);
      headings[node.parentIndex].children.push(node);
    }
    delete node.parentIndex;
    delete node.level;
  });

  return headings.filter((v, k) => !rootNodeIds.includes(k));
}

module.exports = search;
