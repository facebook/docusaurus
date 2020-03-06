/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

const useTabGroupChoice = () => {
  const [choices, setChoices] = useState({});
  const setChoiceSyncWithLocalStorage = useCallback(
    newChoices => {
      try {
        localStorage.setItem('tab-group', JSON.stringify(newChoices));
      } catch (err) {
        console.error(err);
      }
    },
    [setChoices],
  );

  useEffect(() => {
    try {
      const localStorageChoice = JSON.parse(localStorage.getItem('tab-group'));
      if (localStorageChoice !== null) {
        setChoices(localStorageChoice);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setChoices]);

  return {
    getTabGroupChoice: key => choices[key],
    setTabGroupChoice: (key, value) => {
      const newChoices = {...choices, [key]: value};
      setChoices(newChoices);
      setChoiceSyncWithLocalStorage(newChoices);
    },
  };
};

export default useTabGroupChoice;
