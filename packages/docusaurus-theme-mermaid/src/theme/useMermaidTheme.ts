/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';
import mermaid from 'mermaid';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import type mermaidAPI from 'mermaid/mermaidAPI';
import type {ThemeConfig} from '@docusaurus/theme-mermaid';

const DEFAULT_DARK_THEME = 'dark' as mermaidAPI.Theme.Dark;
const DEFAULT_LIGHT_THEME = 'default' as mermaidAPI.Theme.Default;

/**
 * Gets the theme based on config and current color mode.
 */
export default function useMermaidTheme(): mermaidAPI.Theme {
  const {colorMode} = useColorMode();
  const {mermaid: options} = useThemeConfig() as ThemeConfig;

  const defaultTheme =
    colorMode === 'light' ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME;

  const theme =
    options?.theme?.[colorMode] ?? options?.config?.theme ?? defaultTheme;

  useEffect(() => {
    mermaid.initialize({startOnLoad: true, ...options?.config, theme});
  }, [theme, options]);

  return theme;
}
