/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');
const escapeHtml = require('escape-html');

/** @typedef {import('@docusaurus/types').MarkdownRightTableOfContents} TOC */
/** @typedef {import('unist').Node} Node */

/**
 * @typedef {Object} StringValuedNode
 * @property {string} type
 * @property {string} value
 * @property {number} depth
 * @property {Object} data
 * @property {StringValuedNode[]} children
 */

// https://github.com/syntax-tree/mdast#heading
/**
 * @param {StringValuedNode | undefined} node
 * @returns {string}
 */
function toValue(node) {
  if (node && node.type) {
    switch (node.type) {
      case 'text':
        return escapeHtml(node.value);
      case 'heading':
        return node.children.map(toValue).join('');
      case 'inlineCode':
        return `<code>${escapeHtml(node.value)}</code>`;
      case 'emphasis':
        return `<em>${node.children.map(toValue).join('')}</em>`;
      case 'strong':
        return `<strong>${node.children.map(toValue).join('')}</strong>`;
      case 'delete':
        return `<del>${node.children.map(toValue).join('')}</del>`;
      default:
    }
  }

  return toString(node);
}

// Visit all headings. We `slug` all headings (to account for
// duplicates), but only take h2 and h3 headings.
/**
 * @param {StringValuedNode} node
 * @returns {TOC[]}
 */
function search(node) {
  /** @type {TOC[]} */
  const headings = [];
  let current = -1;
  let currentDepth = 0;

  /**
   * @param {StringValuedNode} child
   * @param {number} index
   * @param {Node | undefined} parent
   * @returns {void}
   */
  const onHeading = (child, index, parent) => {
    const value = toString(child);

    if (parent !== node || !value || child.depth > 3 || child.depth < 2) {
      return;
    }

    const entry = {
      value: toValue(child),
      id: child.data.id,
      children: [],
    };

    if (!headings.length || currentDepth >= child.depth) {
      headings.push(entry);
      current += 1;
      currentDepth = child.depth;
    } else {
      headings[current].children.push(entry);
    }
  };

  visit(node, 'heading', onHeading);

  return headings;
}

module.exports = search;
