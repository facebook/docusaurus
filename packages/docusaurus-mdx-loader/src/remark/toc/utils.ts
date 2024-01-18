/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Node} from 'unist';
import type {
  MdxjsEsm,
  // @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
} from 'mdast-util-mdx';

export const isImport = (child: Node): child is MdxjsEsm => {
  if (child.type === 'mdxjsEsm') {
    return (child as MdxjsEsm).value.startsWith('import');
  }
  return false;
};

export const hasImports = (index: number): boolean => index > -1;

export const isExport = (child: Node): child is MdxjsEsm => {
  if (child.type === 'mdxjsEsm') {
    return (child as MdxjsEsm).value.startsWith('export');
  }
  return false;
};
