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
import {useHistory, useLocation} from '@docusaurus/router';
import {createStorageSlot, listStorageKeys} from '../utils/storageUtils';
import {ReactContextError} from '../utils/reactUtils';

const TAB_CHOICE_PREFIX = 'docusaurus.tab.';

type ContextValue = {
  /** A map from `groupId` to the `value` of the saved choice in storage. */
  readonly tabGroupChoicesInStorage: {readonly [groupId: string]: string};
  /** A map from `searchKey` to the `value` of the choice in query parameter. */
  readonly tabGroupChoicesInQueryParams: {readonly [searchKey: string]: string};
  /** Set the new choice value of a group. */
  readonly setTabGroupChoice: (
    groupId: string | undefined,
    queryString: string | boolean | undefined,
    newChoice: string,
  ) => void;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

function getSearchKey(
  groupId: string | undefined,
  queryString: string | boolean | undefined,
) {
  if (typeof queryString === 'string') {
    return queryString;
  }
  if (queryString === false) {
    return undefined;
  }
  if (queryString === true && !groupId) {
    throw new Error(
      `Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".`,
    );
  }
  return groupId;
}

function useContextValue(): ContextValue {
  // TODO not re-render optimized
  // See https://thisweekinreact.com/articles/useSyncExternalStore-the-underrated-react-api
  const location = useLocation();
  const history = useHistory();

  const [tabGroupChoicesInStorage, setGroupChoicesInStorage] = useState<
    ContextValue['tabGroupChoicesInStorage']
  >({});
  const [tabGroupChoicesInQueryParams, setGroupChoicesInQueryParams] = useState<
    ContextValue['tabGroupChoicesInQueryParams']
  >({});

  const updateLocalStorage = useCallback(
    (groupId: string, newChoice: string) => {
      createStorageSlot(`${TAB_CHOICE_PREFIX}${groupId}`).set(newChoice);
    },
    [],
  );
  const updateHistory = useCallback(
    (searchKey: string, newTabValue: string) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set(searchKey, newTabValue);
      history.replace({...location, search: searchParams.toString()});
    },
    [history, location],
  );

  useEffect(() => {
    try {
      const localStorageChoices: {[groupId: string]: string} = {};
      listStorageKeys().forEach((storageKey) => {
        if (storageKey.startsWith(TAB_CHOICE_PREFIX)) {
          const groupIdFromStorage = storageKey.substring(
            TAB_CHOICE_PREFIX.length,
          );
          localStorageChoices[groupIdFromStorage] =
            createStorageSlot(storageKey).get()!;
        }
      });
      setGroupChoicesInStorage(localStorageChoices);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const setTabGroupChoice = useCallback(
    (
      groupId: string | undefined,
      queryString: string | boolean | undefined,
      newChoice: string,
    ) => {
      const searchKey = getSearchKey(groupId, queryString);
      if (groupId != null) {
        setGroupChoicesInStorage((oldChoices) => ({
          ...oldChoices,
          [groupId]: newChoice,
        }));
        updateLocalStorage(groupId, newChoice);
      }
      if (searchKey != null) {
        setGroupChoicesInQueryParams((oldChoices) => ({
          ...oldChoices,
          [searchKey]: newChoice,
        }));
        updateHistory(searchKey, newChoice);
      }
    },
    [updateLocalStorage, updateHistory],
  );

  return useMemo(
    () => ({
      tabGroupChoicesInStorage,
      tabGroupChoicesInQueryParams,
      setTabGroupChoice,
    }),
    [tabGroupChoicesInStorage, tabGroupChoicesInQueryParams, setTabGroupChoice],
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

type UseTabGroupChoice = {
  selectedValue: string | null;
  setTabGroupChoice: (newChoice: string) => void;
};

export function useTabGroupChoice(
  groupId: string | undefined,
  queryString: string | boolean | undefined,
  defaultValue: string | null,
  values: readonly {value: string}[],
): UseTabGroupChoice {
  const searchKey = getSearchKey(groupId, queryString);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    defaultValue,
  );
  const context = useContext(Context);
  if (context == null) {
    throw new ReactContextError('TabGroupChoiceProvider');
  }

  const setTabGroupChoice = useCallback<UseTabGroupChoice['setTabGroupChoice']>(
    (newChoice) => {
      setSelectedValue(newChoice);
      context.setTabGroupChoice(groupId, queryString, newChoice);
    },
    [context, groupId, queryString],
  );

  // Sync storage, query params, and selected state.
  useEffect(() => {
    const queryParamValue =
      searchKey && context.tabGroupChoicesInQueryParams[searchKey];
    const storageValue = groupId && context.tabGroupChoicesInStorage[groupId];
    const valueToSync = queryParamValue ?? storageValue;
    const isValid =
      !!valueToSync && values.some(({value}) => value === valueToSync);
    if (isValid && valueToSync !== selectedValue) {
      setSelectedValue(valueToSync);
    }
  }, [
    context.tabGroupChoicesInQueryParams,
    context.tabGroupChoicesInStorage,
    groupId,
    searchKey,
    selectedValue,
    values,
  ]);

  return {
    selectedValue,
    setTabGroupChoice,
  };
}
