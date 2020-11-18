/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useCallback} from 'react';
import {useDocsPreferredVersionContext} from './DocsPreferredVersionProvider';
import {useAllDocsData, useDocsData} from '@theme/hooks/useDocs';

import {DEFAULT_PLUGIN_ID} from '@docusaurus/constants';

// TODO improve typing

// Note, the preferredVersion attribute will always be null before mount
export function useDocsPreferredVersion(
  pluginId: string | undefined = DEFAULT_PLUGIN_ID,
) {
  const docsData = useDocsData(pluginId);
  const [state, api] = useDocsPreferredVersionContext();

  const {preferredVersionName} = state[pluginId];

  const preferredVersion = preferredVersionName
    ? docsData.versions.find(
        (version: any) => version.name === preferredVersionName,
      )
    : null;

  const savePreferredVersionName = useCallback(
    (versionName: string) => {
      api.savePreferredVersion(pluginId, versionName);
    },
    [api],
  );

  return {preferredVersion, savePreferredVersionName} as const;
}

export function useDocsPreferredVersionByPluginId() {
  const allDocsData = useAllDocsData();
  const [state] = useDocsPreferredVersionContext();

  function getPluginIdPreferredVersion(pluginId: string) {
    const docsData = allDocsData[pluginId];
    const {preferredVersionName} = state[pluginId];

    return preferredVersionName
      ? docsData.versions.find(
          (version: any) => version.name === preferredVersionName,
        )
      : null;
  }

  const pluginIds = Object.keys(allDocsData);

  const result: Record<
    string,
    any // TODO find a way to type this properly!
  > = {};
  pluginIds.forEach((pluginId) => {
    result[pluginId] = getPluginIdPreferredVersion(pluginId);
  });

  return result;
}
