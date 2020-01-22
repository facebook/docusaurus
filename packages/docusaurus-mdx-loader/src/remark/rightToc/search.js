/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');
const escapeHtml = require('escape-html');
const slugs = require('github-slugger')();

// https://github.com/syntax-tree/mdast#heading
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
const search = node => {
  const headings = [];
  let current = -1;
  let currentDepth = 0;

  slugs.reset();

  const onHeading = (child, index, parent) => {
    const value = toString(child);
    const id =
      child.data && child.data.hProperties && child.data.hProperties.id;
    const slug = slugs.slug(id || value);

    if (parent !== node || !value || child.depth > 3 || child.depth < 2) {
      return;
    }

    const entry = {value: toValue(child), id: slug, children: []};

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
};

module.exports = search;
