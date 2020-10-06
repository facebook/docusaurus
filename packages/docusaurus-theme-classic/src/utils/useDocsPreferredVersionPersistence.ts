/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useCallback, useEffect, useState} from 'react';
import useThemeConfig from './useThemeConfig';

type DocsPreferredVersionConfig = {
  docsPluginId: string | undefined;
};

type DocsPreferredVersionState = string | null;

export function useDocsPreferredVersionPersistence({
  docsPluginId,
}: DocsPreferredVersionConfig) {
  const {
    docs: {versionPersistence},
  } = useThemeConfig();
  const storageKey = `docs-preferred-version-${docsPluginId ?? 'default'}`;

  const [versionState, setVersionState] = useState<DocsPreferredVersionState>(
    null,
  );

  // Init preferred version after React hydration
  useEffect(() => {
    if (versionPersistence === 'none') {
      return;
    }

    setVersionState(window.localStorage.getItem(storageKey));
  }, [storageKey]);

  const setVersionName = useCallback(
    (version: string) => {
      setVersionState(version);

      if (versionPersistence === 'none') {
        return;
      }
      window.localStorage.setItem(storageKey, version);
    },
    [setVersionState, storageKey],
  );

  return {versionName: versionState, setVersionName} as const;
}
