/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import IconMenu from '@theme/IconMenu';
import Logo from '@theme/Logo';
import type {Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import React from 'react';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
  useThemeConfig,
} from '@docusaurus/theme-common';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';

import styles from './styles.module.css';

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

export default function NavbarItems(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  const activeDocPlugin = useActivePlugin();

  const items = useNavbarItems();
  const hasSearchNavbarItem = items.some((item) => item.type === 'search');
  const [leftItems, rightItems] = splitNavbarItems(items);
  return (
    <div className="navbar__inner">
      <div className="navbar__items">
        {(items?.length > 0 || activeDocPlugin) && (
          <button
            aria-label="Navigation bar toggle"
            className="navbar__toggle clean-btn"
            type="button"
            tabIndex={0}
            onClick={mobileSidebar.toggle}
            onKeyDown={mobileSidebar.toggle}>
            <IconMenu />
          </button>
        )}
        <Logo
          className="navbar__brand"
          imageClassName="navbar__logo"
          titleClassName="navbar__title"
        />
        {leftItems.map((item, i) => (
          <NavbarItem {...item} key={i} />
        ))}
      </div>
      <div className="navbar__items navbar__items--right">
        {rightItems.map((item, i) => (
          <NavbarItem {...item} key={i} />
        ))}
        <NavbarColorModeToggle className={styles.colorModeToggle} />
        {!hasSearchNavbarItem && <SearchBar />}
      </div>
    </div>
  );
}
