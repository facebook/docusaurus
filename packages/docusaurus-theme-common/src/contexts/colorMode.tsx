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
  useRef,
  type ReactNode,
} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {ReactContextError} from '../utils/reactUtils';
import {createStorageSlot} from '../utils/storageUtils';
import {useThemeConfig} from '../utils/useThemeConfig';

type ContextValue = {
  /** Current color mode. */
  readonly colorMode: ColorMode;
  /** Set new color mode. */
  readonly setColorMode: (colorMode: ColorMode) => void;

  // TODO legacy APIs kept for retro-compatibility: deprecate them
  readonly isDarkTheme: boolean;
  readonly setLightTheme: () => void;
  readonly setDarkTheme: () => void;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const ColorModeStorageKey = 'theme';
const ColorModeStorage = createStorageSlot(ColorModeStorageKey);

const PrefersDarkModeStorageKey = 'prefers-dark-mode';
const PrefersDarkModeStorage = createStorageSlot(PrefersDarkModeStorageKey);
const storePrefersDarkMode = (prefers: boolean) => {
  PrefersDarkModeStorage.set(prefers.toString());
};

const ColorModes = {
  light: 'light',
  dark: 'dark',
} as const;

export type ColorMode = typeof ColorModes[keyof typeof ColorModes];

// Ensure to always return a valid colorMode even if input is invalid
const coerceToColorMode = (colorMode?: string | null): ColorMode =>
  colorMode === ColorModes.dark ? ColorModes.dark : ColorModes.light;

const getInitialColorMode = (defaultMode: ColorMode | undefined): ColorMode => {
  // The preferred color mode is stored in localStorage so we can compare it
  // with the preferred scheme when the user revisits the site. We compare if
  // it has changed since the last time they visited the site, and if so,
  // we update the color mode to match their preferred scheme.
  if (!ExecutionEnvironment.canUseDOM) {
    return coerceToColorMode(defaultMode);
  }

  // preferredDarkMode is what was last stored
  const preferredDarkMode = PrefersDarkModeStorage.get();
  // prefersDarkMode is what the user prefers now
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  if (prefersDarkMode && preferredDarkMode === 'false') {
    // User preferred light mode but prefers dark mode now
    storePrefersDarkMode(true);
    return ColorModes.dark;
  }
  if (!prefersDarkMode && preferredDarkMode === 'true') {
    // User preferred dark mode but prefers light mode now
    storePrefersDarkMode(false);
    return ColorModes.light;
  }

  // No data => use document tag
  return coerceToColorMode(document.documentElement.getAttribute('data-theme'));
};

const storeColorMode = (newColorMode: ColorMode) => {
  ColorModeStorage.set(coerceToColorMode(newColorMode));
};

function useContextValue(): ContextValue {
  const {
    colorMode: {defaultMode, disableSwitch, respectPrefersColorScheme},
  } = useThemeConfig();
  const [colorMode, setColorModeState] = useState(
    getInitialColorMode(defaultMode),
  );

  useEffect(() => {
    // A site is deployed without disableSwitch
    // => User visits the site and has a persisted value
    // => Site later enabled disableSwitch
    // => Clear the previously stored value to apply the site's setting
    if (disableSwitch) {
      ColorModeStorage.del();
    }
  }, [disableSwitch]);

  useEffect(() => {
    // A site is deployed with respectPrefersColorScheme
    // => User visits the site and has a persisted value
    // => Site later disabled respectPrefersColorScheme
    // => Clear the previously stored value to apply the site's setting
    if (!respectPrefersColorScheme) {
      PrefersDarkModeStorage.del();
    }
  }, [respectPrefersColorScheme]);

  const setColorMode = useCallback(
    (newColorMode: ColorMode | null, options: {persist?: boolean} = {}) => {
      const {persist = true} = options;
      if (newColorMode) {
        setColorModeState(newColorMode);
        if (persist) {
          storeColorMode(newColorMode);
        }
      } else {
        if (respectPrefersColorScheme) {
          setColorModeState(
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? ColorModes.dark
              : ColorModes.light,
          );
        } else {
          setColorModeState(defaultMode);
        }
        ColorModeStorage.del();
      }
    },
    [respectPrefersColorScheme, defaultMode],
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      coerceToColorMode(colorMode),
    );
  }, [colorMode]);

  useEffect(() => {
    if (disableSwitch) {
      return undefined;
    }
    const onChange = (e: StorageEvent) => {
      if (e.key !== ColorModeStorageKey) {
        return;
      }
      const storedColorMode = ColorModeStorage.get();
      if (storedColorMode !== null) {
        setColorMode(coerceToColorMode(storedColorMode));
      }
    };
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, [disableSwitch, setColorMode]);

  // PCS is coerced to light mode when printing, which causes the color mode to
  // be reset to dark when exiting print mode, disregarding user settings. When
  // the listener fires only because of a print/screen switch, we don't change
  // color mode. See https://github.com/facebook/docusaurus/pull/6490
  const previousMediaIsPrint = useRef(false);

  useEffect(() => {
    if (disableSwitch && !respectPrefersColorScheme) {
      return undefined;
    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (window.matchMedia('print').matches || previousMediaIsPrint.current) {
        previousMediaIsPrint.current = window.matchMedia('print').matches;
        return;
      }
      setColorMode(null);
      storePrefersDarkMode(e.matches);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [setColorMode, disableSwitch, respectPrefersColorScheme]);

  return useMemo(
    () => ({
      colorMode,
      setColorMode,
      get isDarkTheme() {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '`useColorMode().isDarkTheme` is deprecated. Please use `useColorMode().colorMode === "dark"` instead.',
          );
        }
        return colorMode === ColorModes.dark;
      },
      setLightTheme() {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '`useColorMode().setLightTheme` is deprecated. Please use `useColorMode().setColorMode("light")` instead.',
          );
        }
        setColorMode(ColorModes.light);
      },
      setDarkTheme() {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '`useColorMode().setDarkTheme` is deprecated. Please use `useColorMode().setColorMode("dark")` instead.',
          );
        }
        setColorMode(ColorModes.dark);
      },
    }),
    [colorMode, setColorMode],
  );
}

export function ColorModeProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const value = useContextValue();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useColorMode(): ContextValue {
  const context = useContext(Context);
  if (context == null) {
    throw new ReactContextError(
      'ColorModeProvider',
      'Please see https://docusaurus.io/docs/api/themes/configuration#use-color-mode.',
    );
  }
  return context;
}
