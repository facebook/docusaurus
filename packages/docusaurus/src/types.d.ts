/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {HelmetServerState} from 'react-helmet-async';

export type ServerEntryParams = {
  routesLocation: {[filePath: string]: string};
  manifestPath: string;
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  onLinksCollected: (params: {
    staticPagePath: string;
    links: string[];
    anchors: string[];
  }) => void;
  onHeadTagsCollected: (
    staticPagePath: string,
    tags: HelmetServerState,
  ) => void;
  outDir: string;
  baseUrl: string;
  ssrTemplate: string;
  noIndex: boolean;
  DOCUSAURUS_VERSION: string;
};
