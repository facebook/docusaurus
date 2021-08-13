/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import toString from 'mdast-util-to-string';
import visit, {Visitor} from 'unist-util-visit';
import {toValue} from '../utils';
import type {TOCItem as TOC} from '@docusaurus/types';
import type {Node} from 'unist';
import type {Heading} from 'mdast';

// Visit all headings. We `slug` all headings (to account for
// duplicates), but only take h2 and h3 headings.
export default function search(node: Node): TOC[] {
  const headings: TOC[] = [];
  let current = -1;
  let currentDepth = 0;

  const visitor: Visitor<Heading> = (child, _index, parent) => {
    const value = toString(child);

    if (parent !== node || !value || child.depth > 3 || child.depth < 2) {
      return;
    }

    const entry: TOC = {
      value: toValue(child),
      id: child.data!.id as string,
      children: [],
    };

    if (!headings.length || currentDepth >= child.depth) {
      headings.push(entry);
      current += 1;
      currentDepth = child.depth;
    } else {
      headings[current].children.push(entry);
    }
  };

  visit(node, 'heading', visitor);

  return headings;
}
