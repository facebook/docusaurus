/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import escapeHtml from 'escape-html';
import type {Parent} from 'unist';
import type {PhrasingContent, Heading} from 'mdast';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {MdxJsxAttributeValueExpression} from 'mdast-util-mdx';

export function stringifyContent(
  node: Parent,
  toString: (param: unknown) => string, // TODO weird but works): string {
): string {
  return (node.children as PhrasingContent[])
    .map((item) => toValue(item, toString))
    .join('');
}

export function toValue(
  node: PhrasingContent | Heading,
  toString: (param: unknown) => string, // TODO weird but works
): string {
  switch (node.type) {
    case 'mdxJsxTextElement': {
      const tag = node.name;
      return `<${tag}>${stringifyContent(node, toString)}</${tag}>`;
    }
    case 'text':
      return escapeHtml(node.value);
    case 'heading':
      return stringifyContent(node, toString);
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`;
    case 'emphasis':
      return `<em>${stringifyContent(node, toString)}</em>`;
    case 'strong':
      return `<strong>${stringifyContent(node, toString)}</strong>`;
    case 'delete':
      return `<del>${stringifyContent(node, toString)}</del>`;
    case 'link':
      return stringifyContent(node, toString);
    default:
      return toString(node);
  }
}

export function assetRequireAttributeValue(
  requireString: string,
  hash: string,
): MdxJsxAttributeValueExpression {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: `require("${requireString}").default${hash && ` + '${hash}'`}`,
    data: {
      estree: {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'require',
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: requireString,
                      raw: `"${requireString}"`,
                    },
                  ],
                  optional: false,
                },
                property: {
                  type: 'Identifier',
                  name: 'default',
                },
                computed: false,
                optional: false,
              },
              operator: '+',
              right: {
                type: 'Literal',
                value: hash,
                raw: `"${hash}"`,
              },
            },
          },
        ],
        sourceType: 'module',
        comments: [],
      },
    },
  };
}
