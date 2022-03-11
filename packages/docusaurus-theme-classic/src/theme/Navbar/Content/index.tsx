/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode} from 'react';
import type {Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
  useThemeConfig,
} from '@docusaurus/theme-common';
import MobileSidebarToggle from '@theme/Navbar/MobileSidebarToggle';
import NavbarLogo from '@theme/Navbar/Logo';
import styles from './styles.module.css';

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarContentLayout({
  mobileSidebarToggle,
  logo,
  leftItems,
  rightItems,
  colorModeToggle,
  searchBar,
}: {
  mobileSidebarToggle: ReactNode;
  logo: ReactNode;
  leftItems: ReactNode;
  rightItems: ReactNode;
  colorModeToggle: ReactNode;
  searchBar: ReactNode;
}) {
  return (
    <div className="navbar__inner">
      <div className="navbar__items">
        {mobileSidebarToggle}
        {logo}
        {leftItems}
      </div>
      <div className="navbar__items navbar__items--right">
        {rightItems}
        {colorModeToggle}
        {searchBar}
      </div>
    </div>
  );
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): JSX.Element {
  return (
    <>
      {items.map((item, i) => (
        <NavbarItem {...item} key={i} />
      ))}
    </>
  );
}

export default function NavbarContent(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();

  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  const autoAddSearchBar = !items.some((item) => item.type === 'search');

  return (
    <NavbarContentLayout
      mobileSidebarToggle={!mobileSidebar.disabled && <MobileSidebarToggle />}
      logo={<NavbarLogo />}
      colorModeToggle={
        <NavbarColorModeToggle className={styles.colorModeToggle} />
      }
      leftItems={<NavbarItems items={leftItems} />}
      rightItems={<NavbarItems items={rightItems} />}
      searchBar={autoAddSearchBar && <SearchBar />}
    />
  );
}
