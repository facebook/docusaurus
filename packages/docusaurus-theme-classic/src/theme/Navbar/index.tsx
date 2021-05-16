/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useState, useEffect} from 'react';
import clsx from 'clsx';

import {useLocation} from '@docusaurus/router';
import SearchBar from '@theme/SearchBar';
import Toggle from '@theme/Toggle';
import useThemeContext from '@theme/hooks/useThemeContext';
import {
  useThemeConfig,
  useDocsPreferredVersion,
} from '@docusaurus/theme-common';
import useHideableNavbar from '@theme/hooks/useHideableNavbar';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import {
  useActivePlugin,
  useLatestVersion,
  useActiveDocContext,
  useActiveDocSidebar,
} from '@theme/hooks/useDocs';
import useWindowSize from '@theme/hooks/useWindowSize';
import NavbarItem from '@theme/NavbarItem';
import {DocSidebarItem} from '@theme/DocSidebar';
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

function Navbar(): JSX.Element {
  const {
    navbar: {items, hideOnScroll, style},
    colorMode: {disableSwitch: disableColorModeSwitch},
    sidebarCollapsible,
  } = useThemeConfig();
  const [sidebarShown, setSidebarShown] = useState(false);
  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();
  const {navbarRef, isNavbarVisible} = useHideableNavbar(hideOnScroll);
  const {isDesktop} = useWindowSize();

  // TODO: need to refactor this
  const plugin = useActivePlugin({failfast: false});
  const pluginId = plugin ? plugin.pluginId : undefined;
  const {activeVersion, activeDoc = {}} = useActiveDocContext(pluginId);
  const {preferredVersion} = useDocsPreferredVersion(pluginId);
  const latestVersion = useLatestVersion(pluginId);
  const version = activeVersion ?? preferredVersion ?? latestVersion;
  const doc = version.docs.find((versionDoc) => versionDoc.id === activeDoc.id);
  const isMainDoc =
    version.mainDocId === activeDoc.id && activeDoc?.sidebar === doc.sidebar;
  const firstDocInActiveSidebar =
    activeVersion?.sidebars[doc?.sidebar]?.some(
      (i) => i.href === activeDoc.pathname,
    ) || false;
  const showDocSidebar = isMainDoc || firstDocInActiveSidebar;
  const {sidebar} = useActiveDocSidebar(pluginId);
  const {pathname} = useLocation();
  const [mainMenuShown, setMainMenuShown] = useState(!showDocSidebar);
  const toggleSidebar = useCallback(() => {
    setSidebarShown(!sidebarShown);
  }, [sidebarShown]);
  const onToggleChange = useCallback(
    (e) => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme],
  );
  const hasSearchNavbarItem = items.some((item) => item.type === 'search');
  const {leftItems, rightItems} = splitNavItemsByPosition(items);

  useEffect(() => {
    if (isDesktop) {
      setSidebarShown(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    if (!sidebarShown) {
      setMainMenuShown(false);
    }
  }, [sidebarShown]);

  useLockBodyScroll(sidebarShown);

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
          {items != null && items.length !== 0 && (
            <button
              aria-label="Navigation bar toggle"
              className="navbar__toggle"
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
            titleClassName={clsx('navbar__title')}
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
                  onClick={() => {
                    // Not sure in this behavior.
                    if (activeDoc.id === (item as any).docId) {
                      setMainMenuShown(false);
                      return;
                    }

                    toggleSidebar();
                  }}
                  key={i}
                />
              ))}
            </ul>
          </div>

          <div className={styles.docSidebarMenu}>
            <button
              type="button"
              className={clsx(
                'button button--secondary button--block margin-bottom--md ',
                styles.backButton,
              )}
              onClick={() => setMainMenuShown(true)}>
              ← Back to main menu
            </button>

            {showDocSidebar && (
              <ul className="menu__list">
                {sidebar.map((item) => (
                  <DocSidebarItem
                    key={item.label}
                    item={item}
                    collapsible={sidebarCollapsible}
                    activePath={pathname}
                    onItemClick={() => setSidebarShown(false)}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
