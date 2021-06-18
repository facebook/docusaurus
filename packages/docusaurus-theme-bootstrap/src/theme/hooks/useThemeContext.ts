/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';

import ThemeContext from '@theme/ThemeContext';
import type {ThemeContextProps} from '@theme/hooks/useThemeContext';

// TODO: Un-stub the theme context (#3730)
function useThemeContext(): ThemeContextProps {
  const context = useContext<ThemeContextProps | undefined>(ThemeContext);
  return context == null ? {isDarkTheme: false} : context;
}

export default useThemeContext;
