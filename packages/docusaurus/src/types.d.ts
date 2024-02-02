/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {HelmetServerState} from 'react-helmet-async';
import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import type {SSRTemplateCompiled} from './templates/templates';

export type SSGParams = {
  trailingSlash: boolean | undefined;
  manifest: Manifest;
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  outDir: string;
  baseUrl: string;
  noIndex: boolean;
  DOCUSAURUS_VERSION: string;
  ssrTemplate: SSRTemplateCompiled;
};

export type AppRenderResult = {
  html: string;
  collectedData: PageCollectedData;
};

export type AppRenderer = (params: {
  pathname: string;
}) => Promise<AppRenderResult>;

export type PageCollectedData = {
  headTags: HelmetServerState;
  links: string[];
  anchors: string[];
  modules: string[];
};

export type SiteCollectedData = {
  [pathname: string]: PageCollectedData;
};
