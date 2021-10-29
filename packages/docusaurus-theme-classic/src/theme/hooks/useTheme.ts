/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useCallback, useEffect} from 'react';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import type {useThemeReturns} from '@theme/hooks/useTheme';
import {useThemeConfig, createStorageSlot} from '@docusaurus/theme-common';

const ThemeStorage = createStorageSlot('theme');

const themes = {
  light: 'light',
  dark: 'dark',
} as const;

type Themes = typeof themes[keyof typeof themes];

// Ensure to always return a valid theme even if input is invalid
const coerceToTheme = (theme?: string | null): Themes => {
  return theme === themes.dark ? themes.dark : themes.light;
};

const getInitialTheme = (defaultMode: Themes | undefined): Themes => {
  if (!ExecutionEnvironment.canUseDOM) {
    return coerceToTheme(defaultMode);
  }
  return coerceToTheme(document.documentElement.getAttribute('data-theme'));
};

const storeTheme = (newTheme: Themes) => {
  createStorageSlot('theme').set(coerceToTheme(newTheme));
};

const useTheme = (): useThemeReturns => {
  const {
    colorMode: {defaultMode, disableSwitch, respectPrefersColorScheme},
  } = useThemeConfig();
  const [theme, setTheme] = useState(getInitialTheme(defaultMode));

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
      const storedTheme = ThemeStorage.get();
      if (storedTheme !== null) {
        setTheme(coerceToTheme(storedTheme));
      }
    } catch (err) {
      console.error(err);
    }
  }, [disableSwitch, setTheme]);

  useEffect(() => {
    if (disableSwitch && !respectPrefersColorScheme) {
      return;
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addListener(({matches}) => {
        setTheme(matches ? themes.dark : themes.light);
      });
  }, [disableSwitch, respectPrefersColorScheme]);

  return {
    isDarkTheme: theme === themes.dark,
    setLightTheme,
    setDarkTheme,
  };
};

export default useTheme;
