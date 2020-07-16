/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import usePluginGlobalData from '@docusaurus/usePluginGlobalData';
import {useLocation} from '@docusaurus/router';

import {GlobalVersionMetadata} from '../../types';
import {createDocsDataUtils} from '../internal/docsGlobalDataUtils';

// Not exposed, not part of api surface
const useDocsData = (docsPluginId: string | undefined) =>
  usePluginGlobalData('docusaurus-plugin-content-docs', docsPluginId);
const useDocsDataUtils = (docsPluginId: string | undefined) => {
  return createDocsDataUtils(useDocsData(docsPluginId));
};

export const useVersions = (
  docsPluginId: string | undefined,
): GlobalVersionMetadata[] => {
  const {versions} = useDocsData(docsPluginId);
  return versions;
};

export const useLatestVersion = (docsPluginId: string | undefined) => {
  const utils = useDocsDataUtils(docsPluginId);
  return utils.getLatestVersion();
};

// Note: return undefined on doc-unrelated pages,
// because there's no version currently considered as active
export const useActiveVersion = (docsPluginId: string | undefined) => {
  const utils = useDocsDataUtils(docsPluginId);
  const {pathname} = useLocation();
  return utils.getActiveVersion(pathname);
};

export const useActiveDocContext = (docsPluginId: string | undefined) => {
  const utils = useDocsDataUtils(docsPluginId);
  const {pathname} = useLocation();
  return utils.getActiveDocContext(pathname);
};
