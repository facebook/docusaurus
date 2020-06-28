/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

const TAB_CHOICE_PREFIX = 'docusaurus.tab.';

const useTabGroupChoice = (): {
  tabGroupChoices: {readonly [groupId: string]: string};
  setTabGroupChoices: (groupId: string, newChoice: string) => void;
} => {
  const [tabGroupChoices, setChoices] = useState<{
    readonly [groupId: string]: string;
  }>({});
  const setChoiceSyncWithLocalStorage = useCallback((groupId, newChoice) => {
    try {
      localStorage.setItem(`${TAB_CHOICE_PREFIX}${groupId}`, newChoice);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    try {
      const localStorageChoices = {};
      for (let i = 0; i < localStorage.length; i += 1) {
        const storageKey = localStorage.key(i) as string;
        if (storageKey.startsWith(TAB_CHOICE_PREFIX)) {
          const groupId = storageKey.substring(TAB_CHOICE_PREFIX.length);
          localStorageChoices[groupId] = localStorage.getItem(storageKey);
        }
      }
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
};

export default useTabGroupChoice;
