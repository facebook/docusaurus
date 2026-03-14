import type {Rule} from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce that translate() calls and <Translate> components use static string literals',
      recommended: true,
      url: 'https://docusaurus.io/docs/i18n/tutorial#translate-your-react-code',
    },
    schema: [],
    messages: {
      dynamicMessage:
        'Translation messages must be static string literals. Dynamic values prevent static extraction.',
      dynamicId:
        'Translation id must be a static string literal. Dynamic values prevent static extraction.',
    },
  },

  create(context) {
    function isStaticValue(node: unknown): boolean {
      if (!node || typeof node !== 'object') {
        return false;
      }
      const n = node as {type: string; value?: unknown; expressions?: unknown[]};
      if (n.type === 'Literal' && typeof n.value === 'string') {
        return true;
      }
      if (n.type === 'TemplateLiteral' && n.expressions?.length === 0) {
        return true;
      }
      return false;
    }

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'translate'
        ) {
          const firstArg = node.arguments[0];

          if (firstArg && firstArg.type === 'ObjectExpression') {
            for (const prop of firstArg.properties) {
              if (prop.type !== 'Property') continue;
              if (prop.key.type !== 'Identifier') continue;

              if (prop.key.name === 'message' && !isStaticValue(prop.value)) {
                context.report({
                  node: prop.value,
                  messageId: 'dynamicMessage',
                });
              }

              if (prop.key.name === 'id' && !isStaticValue(prop.value)) {
                context.report({
                  node: prop.value,
                  messageId: 'dynamicId',
                });
              }
            }
          }
        }
      },

      JSXOpeningElement(node) {
        if (
          node.name.type === 'JSXIdentifier' &&
          node.name.name === 'Translate'
        ) {
          for (const attr of node.attributes) {
            if (attr.type !== 'JSXAttribute') continue;
            if (attr.name.type !== 'JSXIdentifier') continue;
            if (attr.name.name !== 'id') continue;

            if (attr.value?.type === 'JSXExpressionContainer') {
              const expr = attr.value.expression;
              if (!isStaticValue(expr)) {
                context.report({
                  node: attr.value,
                  messageId: 'dynamicId',
                });
              }
            }
          }
        }
      },
    };
  },
};

export default rule;
