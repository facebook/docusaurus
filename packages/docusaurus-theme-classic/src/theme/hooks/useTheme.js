/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const useTheme = () => {
  const {
    siteConfig: {themeConfig: {disableDarkMode}} = {},
  } = useDocusaurusContext();
  const [theme, setTheme] = React.useState(
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme')
      : '',
  );

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    if (disableDarkMode) {
      return;
    }

    try {
      const localStorageTheme = localStorage.getItem('theme');
      if (localStorageTheme !== null) {
        setTheme(localStorageTheme);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setTheme]);

  const setThemeSyncWithLocalStorage = React.useCallback(
    nextTheme => {
      try {
        localStorage.setItem('theme', nextTheme);
        setTheme(nextTheme);
      } catch (err) {
        console.error(err);
      }
    },
    [setTheme],
  );

  return [theme, setThemeSyncWithLocalStorage];
};

export default useTheme;
