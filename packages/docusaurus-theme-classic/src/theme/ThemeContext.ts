/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

export type ThemeContextProps = {
  isDarkTheme: boolean;
  setLightTheme: () => void;
  setDarkTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextProps | undefined>(
  undefined,
);

export default ThemeContext;
