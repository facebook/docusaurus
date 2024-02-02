/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {HelmetServerState} from 'react-helmet-async';
import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';

export type ServerEntryParams = {
  trailingSlash: boolean | undefined;
  manifest: Manifest;
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  outDir: string;
  baseUrl: string;
  ssrTemplate: string;
  noIndex: boolean;
  DOCUSAURUS_VERSION: string;
};

export type ServerEntryResult = {
  html: string;
  collectedData: PageCollectedData;
};

export type ServerEntryRenderer = (params: {
  pathname: string;
  serverEntryParams: ServerEntryParams;
}) => Promise<ServerEntryResult>;

export type PageCollectedData = {
  headTags: HelmetServerState;
  links: string[];
  anchors: string[];
  modules: string[];
};

export type SiteCollectedData = {
  [pathname: string]: PageCollectedData;
};
