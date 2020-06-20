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

/** Get the string tokens representation */
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
    const userTokens = getRepresentation(params.tokens).join('');
    const tempRepresentation = getRepresentation(tempTokens);
    const [begin, content, end] = tempRepresentation;
    const REGEX = `^(${begin})((${content})+(${end})+)+$`;

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

    for (let i = 0; i < sectionIndexes.length; i++) {
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
