/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useState, useEffect} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import SearchBar from '@theme/SearchBar';
import Toggle from '@theme/Toggle';
import useThemeContext from '@theme/hooks/useThemeContext';
import {
  useThemeConfig,
  useMobileSecondaryMenuRenderer,
} from '@docusaurus/theme-common';
import useHideableNavbar from '@theme/hooks/useHideableNavbar';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import useWindowSize from '@theme/hooks/useWindowSize';
import NavbarItem from '@theme/NavbarItem';
import Logo from '@theme/Logo';
import IconMenu from '@theme/IconMenu';

import styles from './styles.module.css';

// retrocompatible with v1
const DefaultNavItemPosition = 'right';

// If split links by left/right
// if position is unspecified, fallback to right (as v1)
function splitNavItemsByPosition(items) {
  const leftItems = items.filter(
    (item) => (item.position ?? DefaultNavItemPosition) === 'left',
  );
  const rightItems = items.filter(
    (item) => (item.position ?? DefaultNavItemPosition) === 'right',
  );
  return {
    leftItems,
    rightItems,
  };
}

function NavbarMobileSidebar({
  sidebarShown,
  toggleSidebar,
}: {
  sidebarShown: boolean;
  toggleSidebar: () => void;
}) {
  useLockBodyScroll(sidebarShown);
  const {
    navbar: {items},
    colorMode: {disableSwitch: disableColorModeSwitch},
  } = useThemeConfig();

  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();
  const onToggleChange = useCallback(
    (e) => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme],
  );

  const mobileSecondaryMenuContent = useMobileSecondaryMenuRenderer()?.({
    toggleSidebar,
  });
  const hasMobileSecondaryMenu = !!mobileSecondaryMenuContent;
  const [mainMenuShown, setMainMenuShown] = useState(true);

  // On sidebar close, reset the sidebar to secondary menu (if any)
  useEffect(() => {
    if (!hasMobileSecondaryMenu) {
      setMainMenuShown(true);
      return;
    }
    if (!sidebarShown) {
      setMainMenuShown(false);
    }
  }, [sidebarShown, hasMobileSecondaryMenu]);

  return (
    <div className="navbar-sidebar">
      <div className="navbar-sidebar__brand">
        <Logo
          className="navbar__brand"
          imageClassName="navbar__logo"
          titleClassName="navbar__title"
        />
        {!disableColorModeSwitch && sidebarShown && (
          <Toggle checked={isDarkTheme} onChange={onToggleChange} />
        )}
      </div>

      <div
        className={clsx('navbar-sidebar__items', styles.menuWrapper, {
          [styles.menuWrapperDocShown]: !mainMenuShown,
        })}>
        <div className="menu">
          <ul className="menu__list">
            {items.map((item, i) => (
              <NavbarItem
                mobile
                {...(item as any)} // TODO fix typing
                onClick={toggleSidebar}
                key={i}
              />
            ))}
          </ul>
        </div>

        <div className={styles.docSidebarSecondaryMenu}>
          <button
            type="button"
            className={clsx('clean-btn', styles.backButton)}
            onClick={() => setMainMenuShown(true)}>
            <Translate
              id="theme.navbar.mobileSidebarSecondaryMenu.backButtonLabel"
              description="The label of the back button to return to main menu, inside the mobile navbar sidebar secondary menu (notably used to display the docs sidebar)">
              ← Back to main menu
            </Translate>
          </button>

          {mobileSecondaryMenuContent}
        </div>
      </div>
    </div>
  );
}

function Navbar(): JSX.Element {
  const {
    navbar: {items, hideOnScroll, style},
    colorMode: {disableSwitch: disableColorModeSwitch},
  } = useThemeConfig();

  const windowSize = useWindowSize();

  // Mobile sidebar not visible on hydration: can avoid SSR rendering
  const shouldRenderSidebarMobile = windowSize === 'mobile'; // || windowSize === 'ssr';

  const [sidebarShown, setSidebarShown] = useState(false);
  const toggleSidebar = useCallback(() => {
    setSidebarShown(!sidebarShown);
  }, [sidebarShown]);
  useEffect(() => {
    if (windowSize === 'desktop') {
      setSidebarShown(false);
    }
  }, [windowSize]);

  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();
  const onToggleChange = useCallback(
    (e) => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme],
  );

  const {navbarRef, isNavbarVisible} = useHideableNavbar(hideOnScroll);

  const hasSearchNavbarItem = items.some((item) => item.type === 'search');
  const {leftItems, rightItems} = splitNavItemsByPosition(items);

  return (
    <nav
      ref={navbarRef}
      className={clsx('navbar', 'navbar--fixed-top', {
        'navbar--dark': style === 'dark',
        'navbar--primary': style === 'primary',
        'navbar-sidebar--show': sidebarShown,
        [styles.navbarHideable]: hideOnScroll,
        [styles.navbarHidden]: hideOnScroll && !isNavbarVisible,
      })}>
      <div className="navbar__inner">
        <div className="navbar__items">
          {items?.length > 0 && (
            <button
              aria-label="Navigation bar toggle"
              className="navbar__toggle clean-btn"
              type="button"
              tabIndex={0}
              onClick={toggleSidebar}
              onKeyDown={toggleSidebar}>
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
          {!disableColorModeSwitch && (
            <Toggle
              className={styles.displayOnlyInLargeViewport}
              checked={isDarkTheme}
              onChange={onToggleChange}
            />
          )}
          {!hasSearchNavbarItem && <SearchBar />}
        </div>
      </div>

      <div
        role="presentation"
        className="navbar-sidebar__backdrop"
        onClick={toggleSidebar}
      />

      {shouldRenderSidebarMobile && (
        <NavbarMobileSidebar
          sidebarShown={sidebarShown}
          toggleSidebar={toggleSidebar}
        />
      )}
    </nav>
  );
}

export default Navbar;
