/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import escapeHtml from 'escape-html';
import toString from 'mdast-util-to-string';
import type {Parent} from 'unist';
import type {PhrasingContent, Heading} from 'mdast';

export function stringifyContent(node: Parent): string {
  return (node.children as PhrasingContent[]).map(toValue).join('');
}

export function toValue(node: PhrasingContent | Heading): string {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value);
    case 'heading':
      return stringifyContent(node);
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`;
    case 'emphasis':
      return `<em>${stringifyContent(node)}</em>`;
    case 'strong':
      return `<strong>${stringifyContent(node)}</strong>`;
    case 'delete':
      return `<del>${stringifyContent(node)}</del>`;
    case 'link':
      return stringifyContent(node);
    default:
      return toString(node);
  }
}
