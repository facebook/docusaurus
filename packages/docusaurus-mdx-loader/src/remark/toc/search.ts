/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import toString from 'mdast-util-to-string';
import visit, {Visitor} from 'unist-util-visit';
import {toValue} from '../utils';
import type {TOCItem} from '@docusaurus/types';
import type {Node} from 'unist';
import type {Heading} from 'mdast';

// Intermediate interface for TOC algorithm
interface SearchItem {
  node: TOCItem;
  level: number;
  parentIndex: number;
}

/**
 *
 * Generate a TOC AST from the raw Markdown contents
 */
export default function search(node: Node): TOCItem[] {
  const headings: SearchItem[] = [];

  const visitor: Visitor<Heading> = (child, _index, parent) => {
    const value = toString(child);

    // depth:1 headings are titles and not included in the TOC
    if (parent !== node || !value || child.depth < 2) {
      return;
    }

    headings.push({
      node: {
        value: toValue(child),
        id: child.data!.id as string,
        children: [],
        level: child.depth,
      },
      level: child.depth,
      parentIndex: -1,
    });
  };

  visit(node, 'heading', visitor);

  const getParentIndex = (prevParentIndex: number, currLevel: number) => {
    let parentIndex = prevParentIndex;
    // We start at the parent of the previous heading
    // Recurse through its ancestors until the current heading would be a child
    while (parentIndex >= 0 && currLevel < headings[parentIndex].level) {
      parentIndex = headings[parentIndex].parentIndex;
    }
    return parentIndex >= 0 ? headings[parentIndex].parentIndex : parentIndex;
  };

  // Assign the correct `parentIndex` for each heading.
  headings.forEach((curr, currIndex) => {
    if (currIndex > 0) {
      const prevIndex = currIndex - 1;
      const prev = headings[prevIndex];
      if (curr.level > prev.level) {
        curr.parentIndex = prevIndex;
      } else if (curr.level < prev.level) {
        curr.parentIndex = getParentIndex(prev.parentIndex, curr.level);
      } else {
        curr.parentIndex = prev.parentIndex;
      }
    }
  });

  const rootNodeIndexes: number[] = [];

  // For a given parentIndex, add each Node into that parent's `children` array
  headings.forEach((heading, i) => {
    if (heading.parentIndex >= 0) {
      headings[heading.parentIndex].node.children.push(heading.node);
    } else {
      rootNodeIndexes.push(i);
    }
  });

  const toc = headings
    .filter((_, k) => rootNodeIndexes.includes(k)) // only return root nodes
    .map((heading) => heading.node); // only return Node, no metadata
  return toc;
}
