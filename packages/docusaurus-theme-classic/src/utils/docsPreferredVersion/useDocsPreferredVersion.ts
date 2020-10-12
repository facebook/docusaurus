/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useCallback} from 'react';
import {useDocsPreferredVersionContext} from './DocsPreferredVersionProvider';
import {useDocsData} from '@theme/hooks/useDocs';

import {DEFAULT_PLUGIN_ID} from '@docusaurus/constants';

// Note, the preferredVersion attribute will always be null before mount
export default function useDocsPreferredVersion(
  pluginId: string | undefined = DEFAULT_PLUGIN_ID,
) {
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
    [api],
  );

  return {preferredVersion, savePreferredVersionName} as const;
}
