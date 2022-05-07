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
  useMemo,
  useContext,
  type ReactNode,
} from 'react';
import {createStorageSlot, listStorageKeys} from '../utils/storageUtils';
import {ReactContextError} from '../utils/reactUtils';

const TAB_CHOICE_PREFIX = 'docusaurus.tab.';

type ContextValue = {
  /** A map from `groupId` to the `value` of the saved choice. */
  readonly tabGroupChoices: {readonly [groupId: string]: string};
  /** Set the new choice value of a group. */
  readonly setTabGroupChoices: (groupId: string, newChoice: string) => void;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function useContextValue(): ContextValue {
  const [tabGroupChoices, setChoices] = useState<{
    readonly [groupId: string]: string;
  }>({});
  const setChoiceSyncWithLocalStorage = useCallback(
    (groupId: string, newChoice: string) => {
      createStorageSlot(`${TAB_CHOICE_PREFIX}${groupId}`).set(newChoice);
    },
    [],
  );

  useEffect(() => {
    try {
      const localStorageChoices: {[groupId: string]: string} = {};
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

  const setTabGroupChoices = useCallback(
    (groupId: string, newChoice: string) => {
      setChoices((oldChoices) => ({...oldChoices, [groupId]: newChoice}));
      setChoiceSyncWithLocalStorage(groupId, newChoice);
    },
    [setChoiceSyncWithLocalStorage],
  );

  return useMemo(
    () => ({tabGroupChoices, setTabGroupChoices}),
    [tabGroupChoices, setTabGroupChoices],
  );
}

export function TabGroupChoiceProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const value = useContextValue();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useTabGroupChoice(): ContextValue {
  const context = useContext(Context);
  if (context == null) {
    throw new ReactContextError('TabGroupChoiceProvider');
  }
  return context;
}
