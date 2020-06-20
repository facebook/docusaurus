/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')();

const template = fs.readFileSync(
  path.resolve(__dirname, './__tests__/template.md'),
  'utf-8',
);
const tempTokens = markdownIt.parse(template);

/** The markdown-it return object tokens with many items, and not all are used,
 * This method transforms the token in their string tags.
 */
function getRepresentation(tokens) {
  const formattedTokens = tokens
    .filter(function filterTokens(token) {
      return !token.type.includes('close') && !token.type.includes('inline');
    })
    .map(function tranformTokens(token) {
      return token.tag;
    });

  return formattedTokens;
}

module.exports = {
  names: ['enforce-api-structure'],
  description: 'Enforces the structure of an API file',
  tags: ['API', 'md', 'structure'],
  function: function rule(params, onError) {
    const tempRepresentation = getRepresentation(tempTokens);
    const [begin, middle, end] = tempRepresentation;
    const REGEX = `^(${begin})((${middle})+(${end})+)+$`;

    const sectionIndexes = params.tokens
      .map(function mapToIndex(token, index) {
        // exclude the title
        return token.type === 'heading_open' && token.tag !== 'h1'
          ? index
          : undefined;
      })
      .filter(function filterIndexes(index) {
        return index !== undefined;
      });

    /**
     * The content relevant for this rule is among each section,
     * this `for` iterates over each interval of section, analyzing the content
     */
    for (let i = 0; i < sectionIndexes.length; i += 1) {
      const content = params.tokens.slice(
        sectionIndexes[i],
        sectionIndexes[i + 1],
      );
      const contentRepresentation = getRepresentation(content).join('');
      const [isValidAPI] = contentRepresentation.match(new RegExp(REGEX)) || [
        '',
      ];
      if (isValidAPI !== contentRepresentation) {
        onError({
          lineNumber: params.tokens[sectionIndexes[i]].lineNumber,
          detail: `This section is not following the recommended structure ${tempRepresentation}`,
          context: params.tokens[sectionIndexes[i]].line,
        });
      }
    }
  },
};
