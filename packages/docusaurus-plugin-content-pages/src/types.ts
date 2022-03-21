/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from '@docusaurus/plugin-content-pages';

export type LoadedContent = Metadata[];

export type PagesContentPaths = {
  contentPath: string;
  contentPathLocalized: string;
};
