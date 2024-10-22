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

export type AppRenderer = {
  render: (params: {pathname: string}) => Promise<AppRenderResult>;

  // It's important to shut down the app renderer
  // Otherwise Node.js require cache leaks memory
  shutdown: () => Promise<void>;
};

export type PageCollectedData = {
  // TODO Docusaurus v4 refactor: helmet state is non-serializable
  //  this makes it impossible to run SSG in a worker thread
  helmet: HelmetServerState;

  links: string[];
  anchors: string[];
  modules: string[];
};

export type SiteCollectedData = {
  [pathname: string]: PageCollectedData;
};
