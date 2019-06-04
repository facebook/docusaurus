/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const visit = require('unist-util-visit');

const createAnchor = id => ({
  type: 'element',
  tagName: 'a',
  properties: {
    ariaHidden: true,
    className: 'anchor',
    id,
  },
});

const createLink = id => ({
  type: 'element',
  tagName: 'a',
  properties: {
    ariaHidden: true,
    className: 'hash-link',
    href: `#${id}`,
  },
  children: [
    {
      type: 'text',
      value: '#',
    },
  ],
});

const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

const visitor = node => {
  const {properties} = node;
  if (!properties || !properties.id || !headings.includes(node.tagName)) {
    return;
  }

  node.children.unshift(createLink(properties.id));
  node.children.unshift(createAnchor(properties.id));

  delete properties.id;
};

const transformer = node => {
  visit(node, 'element', visitor);
};

const plugin = () => transformer;

module.exports = plugin;
