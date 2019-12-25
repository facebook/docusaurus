/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useTheme from '@theme/hooks/useTheme';
import ThemeContext from '@theme/ThemeContext';

function ThemeProvider(props) {
  const [theme, setTheme] = useTheme();

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
