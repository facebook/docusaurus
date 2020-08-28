/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {useThemeReturns} from '@theme/hooks/useTheme';

const themes = {
  light: 'light',
  dark: 'dark',
};

// Ensure to always return a valid theme even if input is invalid
const coerceToTheme = (theme) => {
  return theme === themes.dark ? themes.dark : themes.light;
};

const getInitialTheme = () => {
  if (!ExecutionEnvironment.canUseDOM) {
    return themes.light; // SSR: we don't care
  }
  return coerceToTheme(document.documentElement.getAttribute('data-theme'));
};

const storeTheme = (newTheme) => {
  try {
    localStorage.setItem('theme', coerceToTheme(newTheme));
  } catch (err) {
    console.error(err);
  }
};

const useTheme = (): useThemeReturns => {
  const {
    siteConfig: {
      themeConfig: {colorMode: {disableSwitch = false} = {}} = {},
    } = {},
  } = useDocusaurusContext();
  const [theme, setTheme] = useState(getInitialTheme);

  const setLightTheme = useCallback(() => {
    setTheme(themes.light);
    storeTheme(themes.light);
  }, []);
  const setDarkTheme = useCallback(() => {
    setTheme(themes.dark);
    storeTheme(themes.dark);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', coerceToTheme(theme));
  }, [theme]);

  useEffect(() => {
    if (disableSwitch) {
      return;
    }

    try {
      const localStorageTheme = localStorage.getItem('theme');
      if (localStorageTheme !== null) {
        setTheme(coerceToTheme(localStorageTheme));
      }
    } catch (err) {
      console.error(err);
    }
  }, [setTheme]);

  useEffect(() => {
    if (disableSwitch) {
      return;
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addListener(({matches}) => {
        setTheme(matches ? themes.dark : themes.light);
      });
  }, []);

  return {
    isDarkTheme: theme === themes.dark,
    setLightTheme,
    setDarkTheme,
  };
};

export default useTheme;
