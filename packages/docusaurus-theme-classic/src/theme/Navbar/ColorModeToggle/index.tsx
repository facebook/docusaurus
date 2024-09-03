/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';
import type {Props} from '@theme/Navbar/ColorModeToggle';
import styles from './styles.module.css';

export default function NavbarColorModeToggle({
  className,
}: Props): JSX.Element | null {
  const navbarStyle = useThemeConfig().navbar.style;
  const disabled = useThemeConfig().colorMode.disableSwitch;
  const {colorMode, setColorMode} = useColorMode();

  if (disabled) {
    return null;
  }

  return (
    <ColorModeToggle
      className={className}
      buttonClassName={
        navbarStyle === 'dark' ? styles.darkNavbarColorModeToggle : undefined
      }
      value={colorMode}
      onChange={setColorMode}
    />
  );
}
