/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const isMadeOfIgnoredStrings = ({text, stringsToIgnore}) =>
  text
    .trim()
    .split(/\s+/)
    .every((string) => stringsToIgnore.includes(string));

const isWhitespace = (text) => !text || !text.trim();

const isTextValid = ({text, ignoreWhitespace, stringsToIgnore}) =>
  !!text &&
  !(ignoreWhitespace && isWhitespace(text)) &&
  !isMadeOfIgnoredStrings({
    text,
    stringsToIgnore,
  });

const isStringWithoutExpressions = ({
  text,
  ignoreWhitespace = false,
  stringsToIgnore = [],
} = {}) => {
  switch (text.type) {
    case 'Literal':
      return isTextValid({text: text.value, ignoreWhitespace, stringsToIgnore});
    case 'TemplateLiteral':
      return (
        !text.expressions.length &&
        isTextValid({
          text: text.quasis[0].value.raw,
          ignoreWhitespace,
          stringsToIgnore,
        })
      );
    default:
      return false;
  }
};

const isTextLabelChild = ({
  child,
  ignoreWhitespace = false,
  stringsToIgnore = [],
} = {}) => {
  switch (child.type) {
    case 'JSXText':
      return isTextValid({
        text: child.value,
        ignoreWhitespace,
        stringsToIgnore,
      });
    case 'JSXExpressionContainer':
      return isStringWithoutExpressions({
        text: child.expression,
        ignoreWhitespace,
        stringsToIgnore,
      });
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
  {
    code: 'translate({message: `My page meta title`})',
  },
  {
    code: `<Translate
              id="homepage.title"
              description="The homepage welcome message">
                Welcome to my website
            </Translate>`,
  },
  {
    code: `<Translate
              values={{firstName: 'Sébastien'}}>
                {'Welcome, {firstName}! How are you?'}
            </Translate>`,
  },
  {
    code: `<Translate>{'This'} is {\`valid\`}</Translate>`,
  },
  {
    code: "translate({message: 'My page meta title'})",
  },
  {
    code: "translate({message: 'The logo of site {siteName}'}, {siteName: 'Docusaurus'})",
  },
  {
    code: 'translate({otherProp: metaTitle})',
  },
  {
    code: 'translate({otherProp: `My page meta title`})',
  },
];

module.exports = {
  isTextLabelChild,
  report,
  getCommonValidTests,
  isStringWithoutExpressions,
};
