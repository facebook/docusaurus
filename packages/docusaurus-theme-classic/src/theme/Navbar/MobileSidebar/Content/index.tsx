/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import type {Props} from '@theme/Navbar/MobileSidebar/Content';
import {
  useThemeConfig,
  useLockBodyScroll,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

export default function NavbarMobileSidebar({
  sidebarShown,
  toggleSidebar,
}: Props): JSX.Element {
  useLockBodyScroll(sidebarShown);
  const items = useNavbarItems();

  const secondaryMenu = useNavbarSecondaryMenu({
    sidebarShown,
    toggleSidebar,
  });

  return (
    <div
      className={clsx('navbar-sidebar__items', {
        'navbar-sidebar__items--show-secondary': secondaryMenu.shown,
      })}>
      <div className="navbar-sidebar__item menu">
        <ul className="menu__list">
          {items.map((item, i) => (
            <NavbarItem mobile {...item} onClick={toggleSidebar} key={i} />
          ))}
        </ul>
      </div>

      <div className="navbar-sidebar__item menu">
        {items.length > 0 && (
          <button
            type="button"
            className="clean-btn navbar-sidebar__back"
            onClick={secondaryMenu.hide}>
            <Translate
              id="theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel"
              description="The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)">
              ← Back to main menu
            </Translate>
          </button>
        )}
        {secondaryMenu.content}
      </div>
    </div>
  );
}
