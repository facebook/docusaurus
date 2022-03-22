/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  useThemeConfig,
  type DocsVersionPersistence,
} from '../utils/useThemeConfig';
import {isDocsPluginEnabled} from '../utils/docsUtils';
import {ReactContextError} from '../utils/reactUtils';
import {createStorageSlot} from '../utils/storageUtils';

import {
  useAllDocsData,
  useDocsData,
  type GlobalPluginData,
  type GlobalVersion,
} from '@docusaurus/plugin-content-docs/client';

import {DEFAULT_PLUGIN_ID} from '@docusaurus/constants';

const storageKey = (pluginId: string) => `docs-preferred-version-${pluginId}`;

const DocsPreferredVersionStorage = {
  save: (
    pluginId: string,
    persistence: DocsVersionPersistence,
    versionName: string,
  ): void => {
    createStorageSlot(storageKey(pluginId), {persistence}).set(versionName);
  },

  read: (
    pluginId: string,
    persistence: DocsVersionPersistence,
  ): string | null =>
    createStorageSlot(storageKey(pluginId), {persistence}).get(),

  clear: (pluginId: string, persistence: DocsVersionPersistence): void => {
    createStorageSlot(storageKey(pluginId), {persistence}).del();
  },
};

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

// Initial state is always null as we can't read local storage from node SSR
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
  allDocsData: Record<string, GlobalPluginData>;
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
    const pluginData = allDocsData[pluginId]!;
    const versionExists = pluginData.versions.some(
      (version) => version.name === preferredVersionNameUnsafe,
    );
    if (versionExists) {
      return {preferredVersionName: preferredVersionNameUnsafe};
    }
    DocsPreferredVersionStorage.clear(pluginId, versionPersistence);
    return {preferredVersionName: null};
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

// Value that will be accessible through context: [state,api]
function useContextValue() {
  const allDocsData = useAllDocsData();
  const versionPersistence = useVersionPersistence();
  const pluginIds = useMemo(() => Object.keys(allDocsData), [allDocsData]);

  // Initial state is empty, as we can't read browser storage in node/SSR
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
  }, [versionPersistence]);

  return [state, api] as const;
}

type DocsPreferredVersionContextValue = ReturnType<typeof useContextValue>;

const Context = React.createContext<DocsPreferredVersionContextValue | null>(
  null,
);

export function DocsPreferredVersionContextProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  if (isDocsPluginEnabled) {
    return (
      <DocsPreferredVersionContextProviderUnsafe>
        {children}
      </DocsPreferredVersionContextProviderUnsafe>
    );
  }
  return children;
}

function DocsPreferredVersionContextProviderUnsafe({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const contextValue = useContextValue();
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

function useDocsPreferredVersionContext(): DocsPreferredVersionContextValue {
  const value = useContext(Context);
  if (!value) {
    throw new ReactContextError('DocsPreferredVersionContextProvider');
  }
  return value;
}

// Note, the preferredVersion attribute will always be null before mount
export function useDocsPreferredVersion(
  pluginId: string | undefined = DEFAULT_PLUGIN_ID,
): {
  preferredVersion: GlobalVersion | null | undefined;
  savePreferredVersionName: (versionName: string) => void;
} {
  const docsData = useDocsData(pluginId);
  const [state, api] = useDocsPreferredVersionContext();

  const {preferredVersionName} = state[pluginId]!;

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
    const docsData = allDocsData[pluginId]!;
    const {preferredVersionName} = state[pluginId]!;

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
