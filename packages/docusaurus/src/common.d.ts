/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This file is for types that are common between client/server
// In particular the interface between SSG and serverEntry code

import type {HelmetServerState} from 'react-helmet-async';

export type AppRenderResult = {
  html: string;
  collectedData: PageCollectedData;
};

export type AppRenderer = (params: {
  pathname: string;
}) => Promise<AppRenderResult>;

export type PageCollectedData = {
  helmet: HelmetServerState;
  links: string[];
  anchors: string[];
  modules: string[];
};

export type SiteCollectedData = {
  [pathname: string]: PageCollectedData;
};
