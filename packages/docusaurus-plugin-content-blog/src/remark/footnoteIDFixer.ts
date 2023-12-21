/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {simpleHash} from '@docusaurus/utils';
// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {FootnoteReference, FootnoteDefinition} from 'mdast';

/**
 * In the blog list view, each post will be compiled separately. However, they
 * may use the same footnote IDs. This leads to duplicated DOM IDs and inability
 * to navigate to footnote references. This plugin fixes it by appending a
 * unique hash to each reference/definition.
 */
export default function plugin(): Transformer {
  return async (root, vfile) => {
    const {visit} = await import('unist-util-visit');

    const suffix = `-${simpleHash(vfile.path!, 6)}`;
    visit(root, 'footnoteReference', (node: FootnoteReference) => {
      node.identifier += suffix;
    });
    visit(root, 'footnoteDefinition', (node: FootnoteDefinition) => {
      node.identifier += suffix;
    });
  };
}
