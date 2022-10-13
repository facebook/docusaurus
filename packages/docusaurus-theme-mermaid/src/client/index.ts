/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useMemo} from 'react';
import mermaid from 'mermaid';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import type mermaidAPI from 'mermaid/mermaidAPI';
import type {ThemeConfig} from '@docusaurus/theme-mermaid';

export function useMermaidThemeConfig(): ThemeConfig['mermaid'] {
  return (useThemeConfig() as unknown as ThemeConfig).mermaid;
}

export function useMermaidTheme(): mermaidAPI.Theme {
  const {colorMode} = useColorMode();
  const mermaidThemeConfig = useMermaidThemeConfig();

  const theme = mermaidThemeConfig.theme[colorMode];
  const {options} = mermaidThemeConfig;

  // TODO bad location
  useMemo(() => {
    mermaid.initialize({startOnLoad: true, ...options, theme});
  }, [theme, options]);

  return theme;
}
