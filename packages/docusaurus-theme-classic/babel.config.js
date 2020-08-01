/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const types = require('@babel/types');

module.exports = {
  presets: [['@babel/preset-typescript', {isTSX: true, allExtensions: true}]],
  plugins: [
    () => ({
      visitor: {
        ImportDeclaration(nodePath) {
          const {node} = nodePath;
          const importSource = node.source.value;
          if (importSource.startsWith('@theme-classic/')) {
            const b = types.importDeclaration(
              node.specifiers,
              types.stringLiteral(
                importSource.replace('@theme-classic/', '@theme/'),
              ),
            );
            nodePath.replaceWith(b);
          }
        },
      },
    }),
  ],
};
