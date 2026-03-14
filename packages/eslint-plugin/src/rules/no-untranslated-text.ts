import type {Rule} from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce that JSX text content is wrapped with <Translate> or translate()',
      recommended: false,
      url: 'https://docusaurus.io/docs/i18n/tutorial#translate-your-react-code',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignoredComponents: {
            type: 'array',
            items: {type: 'string'},
            default: ['code', 'Code', 'pre', 'CodeBlock'],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      untranslatedText:
        'Text "{{text}}" is not wrapped in a <Translate> component.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const ignoredComponents: string[] = options.ignoredComponents || [
      'code',
      'Code',
      'pre',
      'CodeBlock',
    ];

    function shouldIgnoreText(text: string): boolean {
      const trimmed = text.trim();
      if (!trimmed) return true;
      if (trimmed.length === 1) return true;
      if (/^[\d.,\s]+$/.test(trimmed)) return true;
      return false;
    }

    function isInsideTranslate(node: Rule.Node): boolean {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'JSXElement' &&
          current.openingElement?.name?.type === 'JSXIdentifier' &&
          current.openingElement.name.name === 'Translate'
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    function isInsideIgnored(node: Rule.Node): boolean {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'JSXElement' &&
          current.openingElement?.name?.type === 'JSXIdentifier' &&
          ignoredComponents.includes(current.openingElement.name.name)
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    return {
      JSXText(node) {
        const text = node.value;
        if (shouldIgnoreText(text)) return;
        if (isInsideTranslate(node)) return;
        if (isInsideIgnored(node)) return;

        const displayText = text.trim().substring(0, 30);
        context.report({
          node,
          messageId: 'untranslatedText',
          data: {text: displayText},
        });
      },
    };
  },
};

export default rule;
