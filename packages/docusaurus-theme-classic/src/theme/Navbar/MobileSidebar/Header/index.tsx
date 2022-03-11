/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import type {Props} from '@theme/Navbar/MobileSidebar/Header';
import IconClose from '@theme/IconClose';
import NavbarLogo from '@theme/Navbar/Logo';

export default function NavbarMobileSidebarHeader({
  toggleSidebar,
}: Props): JSX.Element {
  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <NavbarColorModeToggle className="margin-right--md" />
      <button
        type="button"
        className="clean-btn navbar-sidebar__close"
        onClick={() => toggleSidebar()}>
        <IconClose color="var(--ifm-color-emphasis-600)" />
      </button>
    </div>
  );
}
