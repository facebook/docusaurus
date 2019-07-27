/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');
const slugs = require('github-slugger')();

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

    const entry = {value, id: slug, children: []};

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
