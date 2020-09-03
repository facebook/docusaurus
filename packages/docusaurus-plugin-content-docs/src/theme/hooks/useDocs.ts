/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useLocation} from '@docusaurus/router';
import {
  useAllPluginInstancesData,
  usePluginData,
} from '@docusaurus/useGlobalData';

import {GlobalPluginData, GlobalVersion} from '../../types';
import {
  getActivePlugin,
  getLatestVersion,
  getActiveVersion,
  getActiveDocContext,
  getDocVersionSuggestions,
  GetActivePluginOptions,
} from '../../client/docsClientUtils';

const useAllDocsData = (): Record<string, GlobalPluginData> =>
  useAllPluginInstancesData('docusaurus-plugin-content-docs');

const useDocsData = (pluginId: string | undefined) =>
  usePluginData('docusaurus-plugin-content-docs', pluginId) as GlobalPluginData;

export const useActivePlugin = (options: GetActivePluginOptions = {}) => {
  const data = useAllDocsData();
  const {pathname} = useLocation();
  return getActivePlugin(data, pathname, options);
};

// versions are returned ordered (most recent first)
export const useVersions = (pluginId: string | undefined): GlobalVersion[] => {
  const data = useDocsData(pluginId);
  return data.versions;
};

export const useLatestVersion = (pluginId: string | undefined) => {
  const data = useDocsData(pluginId);
  return getLatestVersion(data);
};

// Note: return undefined on doc-unrelated pages,
// because there's no version currently considered as active
export const useActiveVersion = (pluginId: string | undefined) => {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getActiveVersion(data, pathname);
};

export const useActiveDocContext = (pluginId: string | undefined) => {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getActiveDocContext(data, pathname);
};

// Useful to say "hey, you are not on the latest docs version, please switch"
export const useDocVersionSuggestions = (pluginId: string | undefined) => {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getDocVersionSuggestions(data, pathname);
};
