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

export default function useMermaidTheme(): mermaidAPI.Theme {
  const {colorMode} = useColorMode();
  const {mermaid: options} = useThemeConfig() as unknown as ThemeConfig;
  const theme = options.theme[colorMode];
  useEffect(() => {
    mermaid.initialize({startOnLoad: true, ...options.mermaidOptions, theme});
  }, [theme, options]);

  return theme;
}
