/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';

import ThemeContext from '@theme/ThemeContext';

type ThemeContextProps = {
  isDarkTheme: boolean;
  setLightTheme: () => void;
  setDarkTheme: () => void;
};

function useThemeContext(): ThemeContextProps {
  const context = useContext<ThemeContextProps>(ThemeContext);
  if (context == null) {
    throw new Error(
      '`useThemeContext` is used outside of `Layout` Component. See https://v2.docusaurus.io/docs/theme-classic#usethemecontext.',
    );
  }
  return context;
}

export default useThemeContext;
