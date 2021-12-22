/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback} from 'react';
import {useDocsPreferredVersionContext} from './DocsPreferredVersionProvider';
import {useAllDocsData, useDocsData, GlobalVersion} from '@theme/hooks/useDocs';

import {DEFAULT_PLUGIN_ID} from '@docusaurus/constants';

// Note, the preferredVersion attribute will always be null before mount
export function useDocsPreferredVersion(
  pluginId: string | undefined = DEFAULT_PLUGIN_ID,
): {
  preferredVersion: GlobalVersion | null | undefined;
  savePreferredVersionName: (versionName: string) => void;
} {
  const docsData = useDocsData(pluginId);
  const [state, api] = useDocsPreferredVersionContext();

  const {preferredVersionName} = state[pluginId];

  const preferredVersion = preferredVersionName
    ? docsData.versions.find((version) => version.name === preferredVersionName)
    : null;

  const savePreferredVersionName = useCallback(
    (versionName: string) => {
      api.savePreferredVersion(pluginId, versionName);
    },
    [api, pluginId],
  );

  return {preferredVersion, savePreferredVersionName} as const;
}

export function useDocsPreferredVersionByPluginId(): Record<
  string,
  GlobalVersion | null | undefined
> {
  const allDocsData = useAllDocsData();
  const [state] = useDocsPreferredVersionContext();

  function getPluginIdPreferredVersion(pluginId: string) {
    const docsData = allDocsData[pluginId];
    const {preferredVersionName} = state[pluginId];

    return preferredVersionName
      ? docsData.versions.find(
          (version) => version.name === preferredVersionName,
        )
      : null;
  }

  const pluginIds = Object.keys(allDocsData);

  const result: Record<string, GlobalVersion | null | undefined> = {};
  pluginIds.forEach((pluginId) => {
    result[pluginId] = getPluginIdPreferredVersion(pluginId);
  });

  return result;
}
