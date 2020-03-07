/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

const TAB_CHOICE_STORAGE_KEY = 'docusaurus.tab-choice';

const useTabGroupChoice = () => {
  const [tabGroupChoices, setChoices] = useState([]);
  const setChoiceSyncWithLocalStorage = useCallback(
    newChoice => {
      try {
        localStorage.setItem(TAB_CHOICE_STORAGE_KEY, JSON.stringify(newChoice));
      } catch (err) {
        console.error(err);
      }
    },
    [setChoices],
  );

  useEffect(() => {
    try {
      const localStorageChoice = localStorage.getItem(TAB_CHOICE_STORAGE_KEY);
      if (localStorageChoice !== null) {
        setChoices(JSON.parse(localStorageChoice));
      }
    } catch (err) {
      console.error(err);
    }
  }, [setChoices]);

  return {
    tabGroupChoices,
    setTabGroupChoices: (oldChoice, newChoice) => {
      const newChoices = [];
      let foundOldChoice = false;
      tabGroupChoices.forEach(choice => {
        if (choice === oldChoice) {
          foundOldChoice = true;
          newChoices.push(newChoice);
        } else {
          newChoices.push(choice);
        }
      });
      if (!foundOldChoice) {
        newChoices.push(newChoice);
      }
      setChoices(newChoices);
      setChoiceSyncWithLocalStorage(newChoices);
    },
  };
};

export default useTabGroupChoice;
