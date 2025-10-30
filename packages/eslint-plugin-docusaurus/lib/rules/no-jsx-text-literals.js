/**
 * @fileoverview Disallow plain text literals in JSX to encourage use of i18n/Translate
 */

'use strict';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow literal text in JSX (encourage <Translate> or i18n usage)',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // no options
    messages: {
      noJsxText: 'Avoid using raw text in JSX — wrap translatable text with <Translate> or use i18n APIs.',
    },
  },

  create(context) {
    // helper: find nearest ancestor JSX element name (if any)
    function findAncestorElementName(node) {
      let p = node.parent;
      while (p) {
        if (p.type === 'JSXElement' && p.openingElement && p.openingElement.name) {
          const nameNode = p.openingElement.name;
          // handle simple identifier names only (e.g., Translate, div)
          if (nameNode.type === 'JSXIdentifier' && nameNode.name) {
            return nameNode.name;
          }
          // handle MemberExpressions like Some.Namespace.Component (rare in JSX)
          if (nameNode.type === 'JSXMemberExpression') {
            let parts = [];
            let curr = nameNode;
            while (curr) {
              if (curr.property && curr.property.name) parts.unshift(curr.property.name);
              if (curr.object && curr.object.name) { parts.unshift(curr.object.name); break; }
              curr = curr.object;
            }
            return parts.join('.');
          }
        }
        p = p.parent;
      }
      return null;
    }

    const ignoreTags = new Set(['code', 'pre', 'script', 'style', 'Translate']);

    return {
      JSXText(node) {
        if (!node || !node.value) {
          return;
        }
        const text = node.value.trim();
        if (!text) {
          return;
        }

        // If inside an ignored tag (including Translate), skip
        const ancestorName = findAncestorElementName(node);
        if (ancestorName && ignoreTags.has(ancestorName)) {
          return;
        }

        context.report({
          node,
          messageId: 'noJsxText',
        });
      },

      Literal(node) {
        // Flag string literals used as children: e.g. { 'Hello' }
        if (typeof node.value === 'string' && node.parent && node.parent.type === 'JSXExpressionContainer') {
          const text = node.value.trim();
          if (!text) return;

          // If inside ignored tag (including Translate), skip
          const ancestorName = findAncestorElementName(node);
          if (ancestorName && ignoreTags.has(ancestorName)) {
            return;
          }

          context.report({
            node,
            messageId: 'noJsxText',
          });
        }
      },
    };
  },
};
