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
  /** Current color mode choice (can be 'auto'). */
  readonly colorModeChoice: ColorModeChoice;
  /** Set new color mode. */
  readonly setColorMode: (colorMode: ColorModeChoice) => void;

  // TODO legacy APIs kept for retro-compatibility: deprecate them
  readonly isDarkTheme: boolean;
  readonly setLightTheme: () => void;
  readonly setDarkTheme: () => void;
};

const Context = React.createContext<ContextValue | undefined>(undefined);

const ColorModeStorageKey = 'theme';
const ColorModeStorage = createStorageSlot(ColorModeStorageKey);

const ColorModeChoices = {
  auto: 'auto',
  light: 'light',
  dark: 'dark',
} as const;

export type ColorModeChoice =
  typeof ColorModeChoices[keyof typeof ColorModeChoices];

const ColorModes = {
  light: 'light',
  dark: 'dark',
} as const;

export type ColorMode = (typeof ColorModes)[keyof typeof ColorModes];

// Ensure to always return a valid colorModeChoice even if input is invalid
const coerceToColorMode = (
  colorModeChoice?: string | null,
): ColorModeChoice => {
  switch (colorModeChoice) {
    case ColorModeChoices.light:
      return ColorModeChoices.light;
    case ColorModeChoices.dark:
      return ColorModeChoices.dark;
    case ColorModeChoices.auto:
    default:
      return ColorModeChoices.auto;
  }
};

const getInitialColorMode = (
  defaultMode: ColorModeChoice | undefined,
): ColorModeChoice =>
  coerceToColorMode(
    ExecutionEnvironment.canUseDOM
      ? document.documentElement.getAttribute('data-theme-choice') ??
          document.documentElement.getAttribute('data-theme')
      : defaultMode,
  );

const storeColorMode = (newColorMode: ColorModeChoice) => {
  ColorModeStorage.set(coerceToColorMode(newColorMode));
};

function useContextValue(): ContextValue {
  const {
    colorMode: {defaultMode, disableSwitch},
  } = useThemeConfig();
  const [colorModeChoice, setColorModeState] = useState(
    getInitialColorMode(defaultMode),
  );
  const colorMode = useMemo(() => {
    switch (colorModeChoice) {
      case ColorModeChoices.light:
        return ColorModes.light;
      case ColorModeChoices.dark:
        return ColorModes.dark;
      case ColorModeChoices.auto:
      default:
        return ExecutionEnvironment.canUseDOM &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? ColorModes.dark
          : ColorModes.light;
    }
  }, [colorModeChoice]);

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
    (
      newColorMode: ColorModeChoice | null,
      options: {persist?: boolean} = {},
    ) => {
      const {persist = true} = options;
      if (newColorMode) {
        setColorModeState(newColorMode);
        if (persist) {
          storeColorMode(newColorMode);
        }
      } else {
        setColorModeState(defaultMode);
        ColorModeStorage.del();
      }
    },
    [defaultMode],
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
    document.documentElement.setAttribute('data-theme-choice', colorModeChoice);
  }, [colorMode, colorModeChoice]);

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
    if (disableSwitch && colorModeChoice !== 'auto') {
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
  }, [setColorMode, disableSwitch, colorModeChoice]);

  return useMemo(
    () => ({
      colorModeChoice,
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
    [colorModeChoice, colorMode, setColorMode],
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
