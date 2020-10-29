/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const escapeHtml = require('escape-html');
const toString = require('mdast-util-to-string');

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

module.exports = {
  toValue,
};
