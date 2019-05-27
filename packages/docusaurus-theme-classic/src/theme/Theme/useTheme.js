/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useState, useEffect} from 'react';

const useTheme = () => {
  const [isDarkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document
      .querySelector('html')
      .setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  const toggleDarkMode = () => {
    if (isDarkMode) {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  };
  return {isDarkMode, toggleDarkMode};
};
export default useTheme;
