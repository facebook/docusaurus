/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {HtmlTagObject} from '@docusaurus/types';
import htmlTags from 'html-tags';
import voidHtmlTags from 'html-tags/void';

function assertIsHtmlTagObject(val: any): asserts val is HtmlTagObject {
  if (!_.isPlainObject(val)) {
    throw new Error(`"${val}" is not a valid HTML tag object`);
  }
  if (typeof val.tagName !== 'string') {
    throw new Error(
      `${JSON.stringify(
        val,
      )} is not a valid HTML tag object. "tagName" must be defined as a string`,
    );
  }
}

export function htmlTagObjectToString(tagDefinition: any): string {
  assertIsHtmlTagObject(tagDefinition);
  if (htmlTags.indexOf(tagDefinition.tagName) === -1) {
    throw new Error(
      `Error loading ${JSON.stringify(tagDefinition)}, "${
        tagDefinition.tagName
      }" is not a valid HTML tags`,
    );
  }
  const isVoidTag = voidHtmlTags.indexOf(tagDefinition.tagName) !== -1;
  const tagAttributes = tagDefinition.attributes || {};
  const attributes = Object.keys(tagAttributes)
    .filter(attributeName => tagAttributes[attributeName] !== false)
    .map(attributeName => {
      if (tagAttributes[attributeName] === true) {
        return attributeName;
      }
      return `${attributeName}="${tagAttributes[attributeName]}"`;
    });
  return `<${[tagDefinition.tagName]
    .concat(attributes)
    .join(' ')}>${(!isVoidTag && tagDefinition.innerHTML) || ''}${
    isVoidTag ? '' : `</${tagDefinition.tagName}>`
  }`;
}
