/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it')();

const template = fs.readFileSync(path.resolve(__dirname, './template.md'), 'utf-8');
const tempTokens = markdownIt.parse(template);
const REGEX = /^(h3)((p)+(code)+)+$/;

function getRepresentation(tokens) {
  const formattedTokens = tokens
    .filter(function filterTokens(token) {
      return !token.type.includes('close') && !token.type.includes('inline');
    })
    .map(function tranformTokens(token) {
      return token.tag;
    });

  return formattedTokens.join('');
}

module.exports = {
  names: ['enforce-api-structure'],
  description: 'Enforces the structure of an API file',
  tags: ['API', 'md', 'structure'],
  function: function rule(params, onError) {
    console.log('here')
    // Add file config
    const myTokens = params.tokens
      .filter(function filterTokens(token) {
        return !token.type.includes('close') && !token.type.includes('inline');
      })
      .map(function tranformTokens(token) {
        return token.tag;
      });
    const tempRepresentation = getRepresentation(tempTokens);
    console.log(tempRepresentation)
    const indexes = params.tokens
      .map(function mapToIndex(token, index) {
        const isNewSection = token.type === 'heading_open';
        if (isNewSection) return index;
        return undefined;
      })
      .filter(function filterIndexes(index) {
        return index !== undefined;
      });
    // Extract to a method - change to a functional way?
    for (let i = 0; i < indexes.length; i++) {
      // slice works with undefined, in case of the index be greater than indexes length
      const content = params.tokens.slice(indexes[i], indexes[i + 1]);
      const contentRepresentation = getRepresentation(content);
      const [isValidAPI] = contentRepresentation.match(REGEX) || [''];
      if (isValidAPI !== contentRepresentation) {
        // see how I'll get these number things
        onError({
          lineNumber: params.tokens[indexes[i]].lineNumber,
          detail: `This section is not following the recommended structure ${tempRepresentation}`,
          context: params.tokens[indexes[i]].line,
        });
      }
    }
  },
};
