/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This file is for types that are common between client/server
// In particular the interface between SSG and serverEntry code

import type {HelmetServerState} from 'react-helmet-async';
import type {RouteBuildMetadata} from '@docusaurus/types';

export type AppRenderResult = {
  html: string;
  collectedData: PageCollectedData;
};

export type AppRenderer = {
  render: (params: {
    pathname: string;

    // TODO Docusaurus v4: remove deprecated postBuild({head}) API
    v4RemoveLegacyPostBuildHeadAttribute: boolean;
  }) => Promise<AppRenderResult>;

  // It's important to shut down the app renderer
  // Otherwise Node.js require cache leaks memory
  shutdown: () => Promise<void>;
};

// Attributes we need internally, for the SSG html template
// They are not exposed to the user in postBuild({routesBuildMetadata})
export type RouteBuildMetadataInternal = {
  htmlAttributes: string;
  bodyAttributes: string;
  title: string;
  meta: string;
  link: string;
  script: string;
};

// This data structure must remain serializable!
// See why: https://github.com/facebook/docusaurus/pull/10826
export type PageCollectedMetadata = {
  public: RouteBuildMetadata;
  internal: RouteBuildMetadataInternal;
  // TODO Docusaurus v4 remove legacy unserializable helmet data structure
  // See https://github.com/facebook/docusaurus/pull/10850
  helmet: HelmetServerState | null;
};

export type PageCollectedData = {
  metadata: PageCollectedMetadata;
  links: string[];
  anchors: string[];
  modules: string[];
};

export type SiteCollectedData = {
  [pathname: string]: PageCollectedData;
};
