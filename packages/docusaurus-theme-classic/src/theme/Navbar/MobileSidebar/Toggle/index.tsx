/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import IconMenu from '@theme/Icon/Menu';

export default function MobileSidebarToggle(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <button
      onClick={mobileSidebar.toggle}
      onKeyDown={mobileSidebar.toggle}
      aria-label="Navigation bar toggle"
      className="navbar__toggle clean-btn"
      type="button"
      tabIndex={0}>
      <IconMenu />
    </button>
  );
}
