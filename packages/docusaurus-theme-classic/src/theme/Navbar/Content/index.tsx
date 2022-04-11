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
  useWindowSize,
} from '@docusaurus/theme-common';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
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

function NavbarContentLayout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="navbar__inner">
      <div className="navbar__items">{left}</div>
      <div className="navbar__items navbar__items--right">{right}</div>
    </div>
  );
}

export default function NavbarContent(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();
  const windowSize = useWindowSize();
  const isMobile = windowSize === 'mobile';

  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const isSearchItem = (item: NavbarItemConfig) => item.type === 'search';
  const hasExplicitSearchItem = items.some(isSearchItem);

  const rightMostItems = [
    <NavbarColorModeToggle
      key="toggle"
      className={isMobile ? 'margin-left--sm' : undefined}
    />,
    !hasExplicitSearchItem || isMobile ? <SearchBar /> : null,
  ];
  if (isMobile) {
    [rightMostItems[0], rightMostItems[1]] = [
      rightMostItems[1]!,
      rightMostItems[0]!,
    ];
  }

  return (
    <NavbarContentLayout
      left={
        // TODO stop hardcoding items?
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          <NavbarItems
            items={
              isMobile && hasExplicitSearchItem
                ? leftItems.filter((item) => !isSearchItem(item))
                : leftItems
            }
          />
        </>
      }
      right={
        // TODO stop hardcoding items?
        // Ask the user to add the respective navbar items => more flexible
        <>
          <NavbarItems items={rightItems} />
          {rightMostItems}
        </>
      }
    />
  );
}
