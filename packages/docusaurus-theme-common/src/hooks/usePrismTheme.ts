/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import defaultTheme from 'prism-react-renderer/themes/palenight';
import {useColorMode} from '../contexts/colorMode';
import {useThemeConfig} from '../utils/useThemeConfig';

/**
 * Returns a color-mode-dependent Prism theme: whatever the user specified in
 * the config. Falls back to `palenight`.
 */
export function usePrismTheme(): typeof defaultTheme {
  const {prism} = useThemeConfig();
  const {colorMode} = useColorMode();
  const lightModeTheme = prism.theme || defaultTheme;
  const darkModeTheme = prism.darkTheme || lightModeTheme;
  const prismTheme = colorMode === 'dark' ? darkModeTheme : lightModeTheme;

  return prismTheme;
}
