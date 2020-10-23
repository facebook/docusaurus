/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import defaultTheme from 'prism-react-renderer/themes/palenight';
import useThemeContext from '@theme/hooks/useThemeContext';
import useThemeConfig from '../../utils/useThemeConfig';

const usePrismTheme = (): typeof defaultTheme => {
  const {prism} = useThemeConfig();
  const {isDarkTheme} = useThemeContext();
  const lightModeTheme = prism.theme || defaultTheme;
  const darkModeTheme = prism.darkTheme || lightModeTheme;
  const prismTheme = isDarkTheme ? darkModeTheme : lightModeTheme;

  return prismTheme;
};

export default usePrismTheme;
