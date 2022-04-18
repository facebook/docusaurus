/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const isFalsyOrWhitespace = (value) => !value || !value.trim();

const isTextLabelChild = ({child, includeWhitespace = true} = {}) => {
  switch (child.type) {
    case 'JSXText':
      return includeWhitespace || !isFalsyOrWhitespace(child.value);
    case 'JSXExpressionContainer':
      switch (child.expression.type) {
        case 'Literal':
          return true;
        case 'TemplateLiteral':
          return child.expression.expressions.length === 0;
        default:
          return false;
      }
    default:
      return false;
  }
};

const report = (context, node, messageId) => {
  context.report({
    node,
    messageId,
  });
};

const getCommonValidTests = () => [
  {
    code: '<Translate>text</Translate>',
  },
  {
    code: '<Translate> text </Translate>',
  },
  {
    code: '<Translate>"text"</Translate>',
  },
  {
    code: "<Translate>'text'</Translate>",
  },
  {
    code: '<Translate>`text`</Translate>',
  },
  {
    code: '<Translate>{"text"}</Translate>',
  },
  {
    code: "<Translate>{'text'}</Translate>",
  },
  {
    code: '<Translate>{`text`}</Translate>',
  },
  {
    code: '<Component>{text}</Component>',
  },
  {
    code: '<Component> {text} </Component>',
  },
];

module.exports = {isTextLabelChild, report, getCommonValidTests};
