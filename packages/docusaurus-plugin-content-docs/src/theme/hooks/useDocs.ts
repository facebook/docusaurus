/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useLocation} from '@docusaurus/router';

import {GlobalVersionMetadata} from '../../types';
import {
  useDocsPluginData,
  getLatestVersion,
  getActiveVersion,
  getActiveDocContext,
} from '../../client/docsClientUtils';

// versions are returned ordered (most recent first)
export const useVersions = (
  docsPluginId: string | undefined,
): GlobalVersionMetadata[] => {
  const data = useDocsPluginData(docsPluginId);
  return data.versions;
};

export const useLatestVersion = (docsPluginId: string | undefined) => {
  const data = useDocsPluginData(docsPluginId);
  return getLatestVersion(data);
};

// Note: return undefined on doc-unrelated pages,
// because there's no version currently considered as active
export const useActiveVersion = (docsPluginId: string | undefined) => {
  const data = useDocsPluginData(docsPluginId);
  const {pathname} = useLocation();
  return getActiveVersion(data, pathname);
};

export const useActiveDocContext = (docsPluginId: string | undefined) => {
  const data = useDocsPluginData(docsPluginId);
  const {pathname} = useLocation();
  return getActiveDocContext(data, pathname);
};
