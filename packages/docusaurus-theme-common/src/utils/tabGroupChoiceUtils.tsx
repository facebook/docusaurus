/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  useCallback,
  useEffect,
  createContext,
  useMemo,
  useContext,
  type ReactNode,
} from 'react';
import {createStorageSlot, listStorageKeys} from './storageUtils';
import {ReactContextError} from './reactUtils';

const TAB_CHOICE_PREFIX = 'docusaurus.tab.';

type TabGroupChoiceContextValue = {
  readonly tabGroupChoices: {readonly [groupId: string]: string};
  readonly setTabGroupChoices: (groupId: string, newChoice: string) => void;
};

const TabGroupChoiceContext = createContext<
  TabGroupChoiceContextValue | undefined
>(undefined);

function useTabGroupChoiceContextValue(): TabGroupChoiceContextValue {
  const [tabGroupChoices, setChoices] = useState<{
    readonly [groupId: string]: string;
  }>({});
  const setChoiceSyncWithLocalStorage = useCallback((groupId, newChoice) => {
    createStorageSlot(`${TAB_CHOICE_PREFIX}${groupId}`).set(newChoice);
  }, []);

  useEffect(() => {
    try {
      const localStorageChoices: Record<string, string> = {};
      listStorageKeys().forEach((storageKey) => {
        if (storageKey.startsWith(TAB_CHOICE_PREFIX)) {
          const groupId = storageKey.substring(TAB_CHOICE_PREFIX.length);
          localStorageChoices[groupId] = createStorageSlot(storageKey).get()!;
        }
      });
      setChoices(localStorageChoices);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return {
    tabGroupChoices,
    setTabGroupChoices: (groupId: string, newChoice: string) => {
      setChoices((oldChoices) => ({...oldChoices, [groupId]: newChoice}));
      setChoiceSyncWithLocalStorage(groupId, newChoice);
    },
  };
}

export function TabGroupChoiceProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const {tabGroupChoices, setTabGroupChoices} = useTabGroupChoiceContextValue();
  const contextValue = useMemo(
    () => ({
      tabGroupChoices,
      setTabGroupChoices,
    }),
    [tabGroupChoices, setTabGroupChoices],
  );
  return (
    <TabGroupChoiceContext.Provider value={contextValue}>
      {children}
    </TabGroupChoiceContext.Provider>
  );
}

export function useTabGroupChoice(): TabGroupChoiceContextValue {
  const context = useContext(TabGroupChoiceContext);
  if (context == null) {
    throw new ReactContextError('TabGroupChoiceProvider');
  }
  return context;
}
