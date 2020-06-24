/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {matchPath, useLocation} from '@docusaurus/router';

const DefaultDocsPluginPath = 'docs';

export const useDocsGlobalData = (docsPluginPath = DefaultDocsPluginPath) => {
  const {globalData} = useDocusaurusContext();
  const docsData = globalData['docusaurus-plugin-content-docs'];
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

export const useDocsActiveVersionMetadata = (
  docsPluginPath = DefaultDocsPluginPath,
) => {
  const {versionsMetadata} = useDocsGlobalData(docsPluginPath);
  const {pathname} = useLocation();
  return useMemo(() => {
    return versionsMetadata.find((versionMetadata) => {
      return !!matchPath(pathname, {
        path: versionMetadata.path,
        exact: false,
        strict: false,
      });
    });
  }, [docsPluginPath, versionsMetadata, pathname]);
};
