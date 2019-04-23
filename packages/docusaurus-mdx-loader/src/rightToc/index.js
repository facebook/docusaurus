/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const {parse} = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const stringifyObject = require('stringify-object');
const search = require('./search');

const parseOptions = {
  plugins: ['jsx'],
  sourceType: 'module',
};
const isImport = child => child.type === 'import';
const hasImports = index => index > -1;
const isExport = child => child.type === 'export';

const isTarget = (child, name) => {
  let found = false;
  const ast = parse(child.value, parseOptions);
  traverse(ast, {
    VariableDeclarator: path => {
      if (path.node.id.name === name) {
        found = true;
      }
    },
  });

  return found;
};

const getOrCreateExistingTargetIndex = (children, name) => {
  let importsIndex = -1;
  let targetIndex = -1;

  children.forEach((child, index) => {
    if (isImport(child)) {
      importsIndex = index;
    } else if (isExport(child) && isTarget(child, name)) {
      targetIndex = index;
    }
  });

  if (targetIndex === -1) {
    const target = {
      default: false,
      type: 'export',
      value: `export const ${name} = [];`,
    };

    targetIndex = hasImports(importsIndex) ? importsIndex + 1 : 0;
    children.splice(targetIndex, 0, target);
  }

  return targetIndex;
};

const plugin = (options = {}) => {
  const name = options.name || 'rightToc';

  const transformer = node => {
    const headings = search(node);
    const {children} = node;
    const targetIndex = getOrCreateExistingTargetIndex(children, name);

    if (headings && headings.length) {
      children[targetIndex].value = `export const ${name} = ${stringifyObject(
        headings,
      )};`;
    }
  };

  return transformer;
};

module.exports = plugin;
