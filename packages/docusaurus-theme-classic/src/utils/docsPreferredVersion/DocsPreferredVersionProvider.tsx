/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import useThemeConfig, {DocsVersionPersistence} from '../useThemeConfig';

import {useAllDocsData} from '@theme/hooks/useDocs';
import DocsPreferredVersionStorage from './DocsPreferredVersionStorage';

type DocsPreferredVersionName = string | null;

// State for a single docs plugin instance
type DocsPreferredVersionPluginState = {
  preferredVersionName: DocsPreferredVersionName;
};

// We need to store in state/storage globally
// one preferred version per docs plugin instance
// pluginId => pluginState
type DocsPreferredVersionState = Record<
  string,
  DocsPreferredVersionPluginState
>;

function useVersionPersistence(): DocsVersionPersistence {
  return useThemeConfig().docs.versionPersistence;
}

// Read local storage for all docs plugins
// Assign to each doc plugin a preferred version (if found)
function useInitialState(): DocsPreferredVersionState {
  const allDocsData = useAllDocsData();
  const versionPersistence = useVersionPersistence();

  function computeInitialState(): DocsPreferredVersionState {
    // The storage value we read might be stale,
    // and belong to a version that does not exist in the site anymore
    // In such case, we remove the storage value to avoid downstream errors
    function readPreferredVersionName(
      pluginId: string,
    ): DocsPreferredVersionName {
      const preferredVersionNameUnsafe = DocsPreferredVersionStorage.read(
        pluginId,
        versionPersistence,
      );
      const pluginData = allDocsData[pluginId];
      const versionExists = pluginData.versions.some(
        (version) => version.name === preferredVersionNameUnsafe,
      );
      if (versionExists) {
        return preferredVersionNameUnsafe;
      } else {
        DocsPreferredVersionStorage.clear(pluginId, versionPersistence);
        return null;
      }
    }

    const initialState: DocsPreferredVersionState = {};
    Object.keys(allDocsData).forEach((pluginId) => {
      initialState[pluginId] = {
        preferredVersionName: readPreferredVersionName(pluginId),
      };
    });

    return initialState;
  }

  return useMemo(computeInitialState, [allDocsData]);
}

// Value that  will be accessible through context: [state,api]
function useContextValue() {
  const initialState = useInitialState();
  const versionPersistence = useVersionPersistence();

  const [state, setState] = useState<DocsPreferredVersionState>(initialState);

  // Return a constant api object
  const api = useMemo(() => {
    function savePreferredVersion(pluginId: string, versionName: string) {
      DocsPreferredVersionStorage.save(
        pluginId,
        versionPersistence,
        versionName,
      );
      setState((s) => ({
        ...s,
        [pluginId]: {preferredVersionName: versionName},
      }));
    }

    return {
      savePreferredVersion,
    };
  }, [setState]);

  return [state, api] as const;
}

type DocsPreferredVersionContextValue = ReturnType<typeof useContextValue>;

const Context = createContext<DocsPreferredVersionContextValue | null>(null);

export default function DocsPreferredVersionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const contextValue = useContextValue();
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useDocsPreferredVersionContext(): DocsPreferredVersionContextValue {
  const value = useContext(Context);
  if (!value) {
    throw new Error(
      "Can't find docs preferred context, maybe you forgot to use the DocsPreferredVersionContextProvider ?",
    );
  }
  return value;
}
