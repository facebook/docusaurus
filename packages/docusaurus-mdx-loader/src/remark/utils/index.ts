/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import escapeHtml from 'escape-html';
import type {Parent, Node} from 'unist';
import type {PhrasingContent, Heading} from 'mdast';
import type {
  MdxJsxAttribute,
  MdxJsxAttributeValueExpression,
  MdxJsxTextElement,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-mdx';

/**
 * Util to transform one node type to another node type
 * The input node is mutated in place
 * @param node the node to mutate
 * @param newNode what the original node should become become
 */
export function transformNode<NewNode extends Node>(
  node: Node,
  newNode: NewNode,
): NewNode {
  Object.keys(node).forEach((key) => {
    // @ts-expect-error: unsafe but ok
    delete node[key];
  });
  Object.keys(newNode).forEach((key) => {
    // @ts-expect-error: unsafe but ok
    node[key] = newNode[key];
  });
  return node as NewNode;
}

export function stringifyContent(
  node: Parent,
  toString: (param: unknown) => string, // TODO weird but works
): string {
  return (node.children as PhrasingContent[])
    .map((item) => toValue(item, toString))
    .join('');
}

// TODO This is really a workaround, and not super reliable
// For now we only support serializing tagName, className and content
// Can we implement the TOC with real JSX nodes instead of html strings later?
function mdxJsxTextElementToHtml(
  element: MdxJsxTextElement,
  toString: (param: unknown) => string, // TODO weird but works
): string {
  const tag = element.name;

  const attributes = element.attributes.filter(
    (child): child is MdxJsxAttribute => child.type === 'mdxJsxAttribute',
  );

  const classAttribute =
    attributes.find((attr) => attr.name === 'className') ??
    attributes.find((attr) => attr.name === 'class');

  const classAttributeString = classAttribute
    ? `class="${escapeHtml(String(classAttribute.value))}"`
    : ``;

  const allAttributes = classAttributeString ? ` ${classAttributeString}` : '';

  const content = stringifyContent(element, toString);

  return `<${tag}${allAttributes}>${content}</${tag}>`;
}

export function toValue(
  node: PhrasingContent | Heading | MdxJsxTextElement,
  toString: (param: unknown) => string, // TODO weird but works
): string {
  switch (node.type) {
    case 'mdxJsxTextElement': {
      return mdxJsxTextElementToHtml(node as MdxJsxTextElement, toString);
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
