/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useLocation} from '@docusaurus/router';
import {usePluginData, usePluginInstanceData} from '@docusaurus/useGlobalData';

import {GlobalPluginData, GlobalVersion} from '../../types';
import {
  getActivePlugin,
  getLatestVersion,
  getActiveVersion,
  getActiveDocContext,
  getDocVersionSuggestions,
} from '../../client/docsClientUtils';

const useDocsData = (): Record<string, GlobalPluginData> =>
  usePluginData('docusaurus-plugin-content-docs');

const useDocsInstanceData = (docsPluginId: string | undefined) =>
  usePluginInstanceData(
    'docusaurus-plugin-content-docs',
    docsPluginId,
  ) as GlobalPluginData;

export const useActivePlugin = () => {
  const data = useDocsData();
  const {pathname} = useLocation();
  return getActivePlugin(data, pathname);
};

// versions are returned ordered (most recent first)
export const useVersions = (
  docsPluginId: string | undefined,
): GlobalVersion[] => {
  const data = useDocsInstanceData(docsPluginId);
  return data.versions;
};

export const useLatestVersion = (docsPluginId: string | undefined) => {
  const data = useDocsInstanceData(docsPluginId);
  return getLatestVersion(data);
};

// Note: return undefined on doc-unrelated pages,
// because there's no version currently considered as active
export const useActiveVersion = (docsPluginId: string | undefined) => {
  const data = useDocsInstanceData(docsPluginId);
  const {pathname} = useLocation();
  return getActiveVersion(data, pathname);
};

export const useActiveDocContext = (docsPluginId: string | undefined) => {
  const data = useDocsInstanceData(docsPluginId);
  const {pathname} = useLocation();
  return getActiveDocContext(data, pathname);
};

// Useful to say "hey, you are not on the latest docs version, please switch"
export const useDocVersionSuggestions = (docsPluginId: string | undefined) => {
  const data = useDocsInstanceData(docsPluginId);
  const {pathname} = useLocation();
  return getDocVersionSuggestions(data, pathname);
};
