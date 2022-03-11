/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/Navbar/MobileSidebar';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarContent from '@theme/Navbar/MobileSidebar/Content';
import {useLockBodyScroll} from '@docusaurus/theme-common';

export default function NavbarMobileSidebar(props: Props): JSX.Element {
  useLockBodyScroll(props.sidebarShown);

  return (
    <div className="navbar-sidebar">
      <NavbarMobileSidebarHeader {...props} />
      <NavbarMobileSidebarContent {...props} />
    </div>
  );
}
