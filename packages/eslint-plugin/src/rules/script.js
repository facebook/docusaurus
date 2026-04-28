/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'ensure Docusaurus i18n messages are static strings',
      category: 'Best Practices',
      recommended: true,
      url: 'https://docusaurus.io/docs/next/i18n/tutorial#translate-your-react-code',
    },
    fixable: null,
    schema: [],
    messages: {
      dynamicMessage:
        'Docusaurus i18n messages must be static strings. Dynamic values (variables or expressions) cannot be extracted by the translation CLI.',
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        // Cek apakah yang dipanggil adalah fungsi 'translate'
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'translate'
        ) {
          const firstArg = node.arguments[0];

          // Validasi jika argumen pertama adalah objek { message: ... }
          if (firstArg && firstArg.type === 'ObjectExpression') {
            const messageProp = firstArg.properties.find(
              (p) =>
                p.type === 'Property' &&
                p.key.type === 'Identifier' &&
                p.key.name === 'message',
            );

            // Jika properti 'message' ditemukan, cek apakah isinya bukan string murni (Literal)
            if (
              messageProp &&
              messageProp.value.type !== 'Literal' &&
              messageProp.value.type !== 'TemplateLiteral'
            ) {
              context.report({
                node: messageProp.value,
                messageId: 'dynamicMessage',
              });
            }
            
            // Tambahan: Cek TemplateLiteral agar tidak mengandung ekspresi (${var})
            if (
              messageProp &&
              messageProp.value.type === 'TemplateLiteral' &&
              messageProp.value.expressions.length > 0
            ) {
              context.report({
                node: messageProp.value,
                messageId: 'dynamicMessage',
              });
            }
          }
        }
      },
    };
  },
};
      
