/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Heading} from 'mdast';

// Note: this type is exported from mdx-loader and used in theme
// Need to keep it retro compatible
export type TOCItem = {
  readonly value: string;
  readonly id: string;
  readonly level: number;
};

export type TOCHeading = {
  readonly type: 'heading';
  readonly heading: Heading;
};

// A TOC slice represents a TOCItem[] imported from a partial
export type TOCSlice = {
  readonly type: 'slice';
  readonly importName: string;
};

export type TOCItems = (TOCHeading | TOCSlice)[];
