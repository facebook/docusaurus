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
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import {ReactContextError} from './reactUtils';

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {createStorageSlot} from './storageUtils';
import {useThemeConfig} from './useThemeConfig';

type ColorModeContextValue = {
  readonly isDarkTheme: boolean;
  readonly setLightTheme: () => void;
  readonly setDarkTheme: () => void;
};

const ThemeStorageKey = 'theme';
const ThemeStorage = createStorageSlot(ThemeStorageKey);

const themes = {
  light: 'light',
  dark: 'dark',
} as const;

type Themes = typeof themes[keyof typeof themes];

// Ensure to always return a valid theme even if input is invalid
const coerceToTheme = (theme?: string | null): Themes =>
  theme === themes.dark ? themes.dark : themes.light;

const getInitialTheme = (defaultMode: Themes | undefined): Themes => {
  if (!ExecutionEnvironment.canUseDOM) {
    return coerceToTheme(defaultMode);
  }
  return coerceToTheme(document.documentElement.getAttribute('data-theme'));
};

const storeTheme = (newTheme: Themes) => {
  ThemeStorage.set(coerceToTheme(newTheme));
};

function useColorModeContextValue(): ColorModeContextValue {
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
      return undefined;
    }
    const onChange = (e: StorageEvent) => {
      if (e.key !== ThemeStorageKey) {
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
    };
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('storage', onChange);
    };
  }, [disableSwitch, setTheme]);

  // PCS is coerced to light mode when printing, which causes the color mode to
  // be reset to dark when exiting print mode, disregarding user settings. When
  // the listener fires only because of a print/screen switch, we don't change
  // color mode. See https://github.com/facebook/docusaurus/pull/6490
  const previousMediaIsPrint = React.useRef(false);

  useEffect(() => {
    if (disableSwitch && !respectPrefersColorScheme) {
      return undefined;
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = ({matches}: MediaQueryListEvent) => {
      if (window.matchMedia('print').matches || previousMediaIsPrint.current) {
        previousMediaIsPrint.current = window.matchMedia('print').matches;
        return;
      }
      setTheme(matches ? themes.dark : themes.light);
    };
    mql.addListener(onChange);
    return () => {
      mql.removeListener(onChange);
    };
  }, [disableSwitch, respectPrefersColorScheme]);

  return {
    isDarkTheme: theme === themes.dark,
    setLightTheme,
    setDarkTheme,
  };
}

const ColorModeContext = React.createContext<ColorModeContextValue | undefined>(
  undefined,
);

export function ColorModeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const {isDarkTheme, setLightTheme, setDarkTheme} = useColorModeContextValue();
  const contextValue = useMemo(
    () => ({isDarkTheme, setLightTheme, setDarkTheme}),
    [isDarkTheme, setLightTheme, setDarkTheme],
  );
  return (
    <ColorModeContext.Provider value={contextValue}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const context = useContext<ColorModeContextValue | undefined>(
    ColorModeContext,
  );
  if (context == null) {
    throw new ReactContextError(
      'ColorModeProvider',
      'Please see https://docusaurus.io/docs/api/themes/configuration#use-color-mode.',
    );
  }
  return context;
}
