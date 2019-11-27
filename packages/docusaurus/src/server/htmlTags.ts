/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {HtmlTagObject} from '@docusaurus/types';
import htmlTags from 'html-tags';
import voidHtmlTags from 'html-tags/void';

export function htmlTagObjectToString(tagDefinition: HtmlTagObject): string {
  if (htmlTags.indexOf(tagDefinition.tagName) === -1) {
    throw new Error(
      `Error loading ${JSON.stringify(tagDefinition)}, "${
        tagDefinition.tagName
      }" is not a valid HTML tags`,
    );
  }
  const isVoidTag = voidHtmlTags.indexOf(tagDefinition.tagName) !== -1;
  const attributes = Object.keys(tagDefinition.attributes || {})
    .filter(attributeName => tagDefinition.attributes[attributeName] !== false)
    .map(attributeName => {
      if (tagDefinition.attributes[attributeName] === true) {
        return attributeName;
      }
      return (
        attributeName + '="' + tagDefinition.attributes[attributeName] + '"'
      );
    });
  return (
    '<' +
    [tagDefinition.tagName].concat(attributes).join(' ') +
    '>' +
    ((!isVoidTag && tagDefinition.innerHTML) || '') +
    (isVoidTag ? '' : '</' + tagDefinition.tagName + '>')
  );
}
