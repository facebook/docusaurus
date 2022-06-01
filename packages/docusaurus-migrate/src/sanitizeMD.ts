/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import markdown from 'remark-parse';
import toJsx from '@mapbox/hast-util-to-jsx';
import unified from 'unified';
import parse from 'rehype-parse';
import visit from 'unist-util-visit';
import remarkStringify from 'remark-stringify';
import htmlTags from 'html-tags';
import toText from 'hast-util-to-string';
import type {Code, InlineCode} from 'mdast';
import type {Element, Text} from 'hast';

const tags = htmlTags.reduce((acc: {[key: string]: boolean}, tag) => {
  acc[tag] = true;
  return acc;
}, {});

export default function sanitizeMD(code: string): string {
  const markdownTree = unified().use(markdown).parse(code);
  visit(markdownTree, 'code', (node: Code) => {
    node.value = `\n<!--${node.value}-->\n`;
  });
  visit(markdownTree, 'inlineCode', (node: InlineCode) => {
    node.value = `<!--${node.value}-->`;
  });

  const markdownString = unified()
    .use(remarkStringify, {fence: '`', fences: true})
    .stringify(markdownTree);

  const htmlTree = unified().use(parse).parse(markdownString);

  visit(htmlTree, 'element', (node: Element) => {
    if (!tags[node.tagName]) {
      (node as Element | Text).type = 'text';
      (node as Element & Partial<Omit<Text, 'type'>>).value =
        node.tagName + toText(node);
      delete (node as Partial<Element>).children;
      delete (node as Partial<Element>).tagName;
    }
  });
  return toJsx(htmlTree)
    .replace(/\{\/\*|\*\/\}/g, '')
    .replace(/\{\/\*|\*\/\}/g, '')
    .replace(/<html><head \/><body>|<\/body><\/html>/g, '');
}
