/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

import {GlobalPluginData, GlobalVersionMetadata} from '../../types';
import {createDocsGlobalDataUtils} from '../internal/docsGlobalDataUtils';

const DefaultDocsPluginPath = 'docs';

// Do not expose, global data shape is internal, not api surface
const useDocsGlobalData = (docsPluginPath = DefaultDocsPluginPath) => {
  const {globalData} = useDocusaurusContext();
  const docsData = globalData[
    'docusaurus-plugin-content-docs'
  ] as GlobalPluginData;
  if (!docsData) {
    throw new Error('no docs plugin global data could be found');
  }
  const docsPluginInstanceData = docsData[docsPluginPath];
  if (!docsPluginInstanceData) {
    throw new Error(
      `no docs global data could be found for instance with path=[${docsPluginPath}]`,
    );
  }
  return docsPluginInstanceData;
};

const useDocsGlobalDataUtils = (docsPluginPath = DefaultDocsPluginPath) => {
  return createDocsGlobalDataUtils(useDocsGlobalData(docsPluginPath));
};

export const useVersions = (
  docsPluginPath = DefaultDocsPluginPath,
): GlobalVersionMetadata[] => {
  const {versions} = useDocsGlobalData(docsPluginPath);
  return versions;
};

export const useLatestVersion = (docsPluginPath = DefaultDocsPluginPath) => {
  const utils = useDocsGlobalDataUtils(docsPluginPath);
  return utils.getLatestVersion();
};

// Note: return undefined on doc-unrelated pages,
// because there's no version currently considered as active
export const useActiveVersion = (docsPluginPath = DefaultDocsPluginPath) => {
  const utils = useDocsGlobalDataUtils(docsPluginPath);
  const {pathname} = useLocation();
  return utils.getActiveVersion(pathname);
};

export const useActiveDocContext = (docsPluginPath = DefaultDocsPluginPath) => {
  const utils = useDocsGlobalDataUtils(docsPluginPath);
  const {pathname} = useLocation();
  return utils.getActiveDocContext(pathname);
};
