/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parse, type ParserOptions} from '@babel/parser';
import traverse from '@babel/traverse';
import stringifyObject from 'stringify-object';
import toString from 'mdast-util-to-string';
import visit from 'unist-util-visit';
import {toMessageRelativeFilePath} from '@docusaurus/utils';
import {toValue} from '../utils';

import type {Identifier} from '@babel/types';
import type {Node, Parent} from 'unist';
import type {Heading, Literal, Paragraph} from 'mdast';
import type {Transformer} from 'unified';

const parseOptions: ParserOptions = {
  plugins: ['jsx'],
  sourceType: 'module',
};

const name = 'structuredDataFaqs';

const isImport = (child: Node): child is Literal => child.type === 'import';
const hasImports = (index: number) => index > -1;
const isExport = (child: Node): child is Literal => child.type === 'export';

const isTarget = (child: Literal) => {
  let found = false;
  const ast = parse(child.value, parseOptions);
  traverse(ast, {
    VariableDeclarator: (path) => {
      if ((path.node.id as Identifier).name === name) {
        found = true;
      }
    },
  });
  return found;
};

const getOrCreateExistingTargetIndex = (children: Node[]) => {
  let importsIndex = -1;
  let targetIndex = -1;

  children.forEach((child, index) => {
    if (isImport(child)) {
      importsIndex = index;
    } else if (isExport(child) && isTarget(child)) {
      targetIndex = index;
    }
  });

  if (targetIndex === -1) {
    const target = {
      default: false,
      type: 'export',
      value: `export const ${name} = [];`,
    };

    targetIndex = hasImports(importsIndex) ? importsIndex + 1 : 0;
    children.splice(targetIndex, 0, target);
  }

  return targetIndex;
};

export default function plugin(): Transformer {
  return (root, vfile) => {
    let rootFaqsHeading: Heading | undefined;
    let readingFAQs = false;
    const faqsNodes: {heading: Heading; paragraphs: Paragraph[]}[] = []; // faqs question -> faqs answer
    let x = 0;
    visit(
      root,
      ['heading', 'paragraph'],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (child: Heading | Paragraph, index, parent) => {
        if (vfile.path?.includes('blog/2022-09-01-docusaurus-2.1/index.mdx')) {
          x += 1;
          console.log(x, 'child', vfile.path, child.type);
        }

        if (readingFAQs && child.type === 'paragraph' && faqsNodes.length > 0) {
          // faqs answers are paragraphs
          faqsNodes[faqsNodes.length - 1]!.paragraphs.push(child);
        } else if (child.type === 'heading') {
          // faqs questions are headings

          const value = toString(child);
          if (child.depth === 2 && value === 'FAQs') {
            if (rootFaqsHeading) {
              throw new Error(
                `Found multiple FAQs headings in ${toMessageRelativeFilePath(
                  vfile.path!,
                )}. Please ensure you only have one faqs heading.`,
              );
            }

            // this is the root faqs heading
            rootFaqsHeading = child;
            readingFAQs = true;
            return;
          }

          if (child.depth === 2 && readingFAQs) {
            // this is the end of the faqs section
            readingFAQs = false;
            return;
          }

          // const x = parent === root;
          // console.log(x)

          if (child.depth === 3 && readingFAQs) {
            // this is a faqs question
            faqsNodes.push({
              heading: child,
              paragraphs: [],
            });
          }

          // // depth: 1 headings are titles and not included in the TOC
          // if (parent !== root || !value || child.depth < 2) {
          //   return;
          // }

          // headings.push({
          //   value: toValue(child),
          //   id: child.data!.id as string,
          //   level: child.depth,
          // });
        }
      },
    );
    const {children} = root as Parent<Literal>;
    const targetIndex = getOrCreateExistingTargetIndex(children);

    if (faqsNodes.length > 0) {
      const faqs = faqsNodes.map(({heading, paragraphs}) => ({
        question: toValue(heading),
        answer: paragraphs.map(toString).join(' '),
      }));

      if (vfile.path?.includes('blog/2022-09-01-docusaurus-2.1/index.mdx')) {
        console.log(x, 'faqsNodes', vfile.path, faqsNodes, faqs, root);
        console.log('faqsNodes', vfile.path, faqs);
      }
      children[targetIndex]!.value = `export const ${name} = ${stringifyObject(
        faqs,
      )};`;
    }
  };
}
