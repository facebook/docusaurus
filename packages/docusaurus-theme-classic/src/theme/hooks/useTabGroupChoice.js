/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

const TAB_CHOICE_STORAGE_KEY = 'docusaurus.tab-choice';

const useTabGroupChoice = () => {
  const [tabGroupChoice, setChoice] = useState();
  const setChoiceSyncWithLocalStorage = useCallback(
    newChoice => {
      try {
        localStorage.setItem(TAB_CHOICE_STORAGE_KEY, newChoice);
      } catch (err) {
        console.error(err);
      }
    },
    [setChoice],
  );

  useEffect(() => {
    try {
      const localStorageChoice = localStorage.getItem(TAB_CHOICE_STORAGE_KEY);
      if (localStorageChoice !== null) {
        setChoice(localStorageChoice);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setChoice]);

  return {
    tabGroupChoice,
    setTabGroupChoice: newChoice => {
      setChoice(newChoice);
      setChoiceSyncWithLocalStorage(newChoice);
    },
  };
};

export default useTabGroupChoice;
