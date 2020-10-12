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
  useEffect,
  useMemo,
  useState,
} from 'react';
import useThemeConfig, {DocsVersionPersistence} from '../useThemeConfig';

import {docsPluginEnabled, useAllDocsData} from '@theme/hooks/useDocs';
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

// Initial state is always null as we can't read localstorage from node SSR
function getInitialState(pluginIds: string[]): DocsPreferredVersionState {
  const initialState: DocsPreferredVersionState = {};
  pluginIds.forEach((pluginId) => {
    initialState[pluginId] = {
      preferredVersionName: null,
    };
  });
  return initialState;
}

// Read storage for all docs plugins
// Assign to each doc plugin a preferred version (if found)
function readStorageState({
  pluginIds,
  versionPersistence,
  allDocsData,
}: {
  pluginIds: string[];
  versionPersistence: DocsVersionPersistence;
  allDocsData: any; // TODO find a way to type it :(
}): DocsPreferredVersionState {
  // The storage value we read might be stale,
  // and belong to a version that does not exist in the site anymore
  // In such case, we remove the storage value to avoid downstream errors
  function restorePluginState(
    pluginId: string,
  ): DocsPreferredVersionPluginState {
    const preferredVersionNameUnsafe = DocsPreferredVersionStorage.read(
      pluginId,
      versionPersistence,
    );
    const pluginData = allDocsData[pluginId];
    const versionExists = pluginData.versions.some(
      (version) => version.name === preferredVersionNameUnsafe,
    );
    if (versionExists) {
      return {preferredVersionName: preferredVersionNameUnsafe};
    } else {
      DocsPreferredVersionStorage.clear(pluginId, versionPersistence);
      return {preferredVersionName: null};
    }
  }

  const initialState: DocsPreferredVersionState = {};
  pluginIds.forEach((pluginId) => {
    initialState[pluginId] = restorePluginState(pluginId);
  });
  return initialState;
}

function useVersionPersistence(): DocsVersionPersistence {
  return useThemeConfig().docs.versionPersistence;
}

// Value that  will be accessible through context: [state,api]
function useContextValue() {
  const allDocsData = useAllDocsData();
  const versionPersistence = useVersionPersistence();
  const pluginIds = useMemo(() => Object.keys(allDocsData), [allDocsData]);

  // Initial state is empty, as  we can't read browser storage in node/SSR
  const [state, setState] = useState(() => getInitialState(pluginIds));

  // On mount, we set the state read from browser storage
  useEffect(() => {
    setState(readStorageState({allDocsData, versionPersistence, pluginIds}));
  }, [allDocsData, versionPersistence, pluginIds]);

  // The API that we expose to consumer hooks (memo for constant object)
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
  if (docsPluginEnabled) {
    return (
      <DocsPreferredVersionContextProviderUnsafe>
        {children}
      </DocsPreferredVersionContextProviderUnsafe>
    );
  } else {
    return <>children</>;
  }
}

function DocsPreferredVersionContextProviderUnsafe({
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
