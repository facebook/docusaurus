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

  // TODO Docusaurus v4
  //  legacy APIs kept for retro-compatibility: deprecate them
  readonly isDarkTheme: boolean;
  readonly setLightTheme: () => void;
  readonly setDarkTheme: () => void;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const ColorModeStorageKey = 'theme';
const ColorModeStorage = createStorageSlot(ColorModeStorageKey);

const ColorModes = {
  light: 'light',
  dark: 'dark',
} as const;

export type ColorMode = (typeof ColorModes)[keyof typeof ColorModes];

// Ensure to always return a valid colorMode even if input is invalid
const coerceToColorMode = (colorMode?: string | null): ColorMode =>
  colorMode === ColorModes.dark ? ColorModes.dark : ColorModes.light;

const ColorModeAttribute = {
  get: () => {
    return coerceToColorMode(
      document.documentElement.getAttribute('data-theme'),
    );
  },
  set: (colorMode: ColorMode) => {
    document.documentElement.setAttribute(
      'data-theme',
      coerceToColorMode(colorMode),
    );
  },
};

const readInitialColorMode = (): ColorMode => {
  if (!ExecutionEnvironment.canUseDOM) {
    throw new Error("Can't read initial color mode on the server");
  }
  return ColorModeAttribute.get();
};

const storeColorMode = (newColorMode: ColorMode) => {
  ColorModeStorage.set(coerceToColorMode(newColorMode));
};

// The color mode state is initialized in useEffect on purpose
// to avoid a React hydration mismatch errors
// The useColorMode() hook value lags behind on purpose
// This helps users avoid hydration mismatch errors in their code
// See also https://github.com/facebook/docusaurus/issues/7986
function useColorModeState() {
  const {
    colorMode: {defaultMode},
  } = useThemeConfig();

  const [colorMode, setColorModeState] = useState(defaultMode);

  useEffect(() => {
    setColorModeState(readInitialColorMode());
  }, []);

  return [colorMode, setColorModeState] as const;
}

function useContextValue(): ContextValue {
  const {
    colorMode: {defaultMode, disableSwitch, respectPrefersColorScheme},
  } = useThemeConfig();
  const [colorMode, setColorModeState] = useColorModeState();

  useEffect(() => {
    // A site is deployed without disableSwitch
    // => User visits the site and has a persisted value
    // => Site later enabled disableSwitch
    // => Clear the previously stored value to apply the site's setting
    if (disableSwitch) {
      ColorModeStorage.del();
    }
  }, [disableSwitch]);

  const setColorMode = useCallback(
    (newColorMode: ColorMode | null, options: {persist?: boolean} = {}) => {
      const {persist = true} = options;

      if (newColorMode) {
        ColorModeAttribute.set(newColorMode);
        setColorModeState(newColorMode);
        if (persist) {
          storeColorMode(newColorMode);
        }
      } else {
        if (respectPrefersColorScheme) {
          const osColorMode = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? ColorModes.dark
            : ColorModes.light;
          ColorModeAttribute.set(osColorMode);
          setColorModeState(osColorMode);
        } else {
          ColorModeAttribute.set(defaultMode);
          setColorModeState(defaultMode);
        }
        ColorModeStorage.del();
      }
    },
    [setColorModeState, respectPrefersColorScheme, defaultMode],
  );

  useEffect(() => {
    if (disableSwitch) {
      return undefined;
    }
    return ColorModeStorage.listen((e) => {
      setColorMode(coerceToColorMode(e.newValue));
    });
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
    const onChange = () => {
      if (window.matchMedia('print').matches || previousMediaIsPrint.current) {
        previousMediaIsPrint.current = window.matchMedia('print').matches;
        return;
      }
      setColorMode(null);
    };
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
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
}): ReactNode {
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
