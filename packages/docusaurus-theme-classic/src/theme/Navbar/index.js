/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useState} from 'react';
import classnames from 'classnames';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import SearchBar from '@theme/SearchBar';
import Toggle from '@theme/Toggle';
import useThemeContext from '@theme/hooks/useThemeContext';
import useHideableNavbar from '@theme/hooks/useHideableNavbar';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import withForwardedRef from '@theme/hocs/withForwardedRef';

import styles from './styles.module.css';

function NavLink({activeBasePath, to, href, label, position, ...props}) {
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);

  return (
    <Link
      className="navbar__item navbar__link"
      {...(href
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
            href,
          }
        : {
            activeClassName: 'navbar__link--active',
            to: toUrl,
            ...(activeBasePath
              ? {
                  isActive: (_match, location) =>
                    location.pathname.startsWith(activeBaseUrl),
                }
              : null),
          })}
      {...props}>
      {label}
    </Link>
  );
}

const Navbar = ({forwardedRef}) => {
  const context = useDocusaurusContext();
  const {siteConfig = {}, isClient} = context;
  const {baseUrl, themeConfig = {}} = siteConfig;
  const {navbar = {}, disableDarkMode = false} = themeConfig;
  const {title, logo = {}, links = [], hideOnScroll = false} = navbar;

  const {isDarkTheme, setLightTheme, setDarkTheme} = useThemeContext();
  const {isNavbarVisible} = useHideableNavbar(hideOnScroll, forwardedRef);

  const [sidebarShown, setSidebarShown] = useState(false);
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);

  const showSidebar = useCallback(() => {
    setSidebarShown(true);
  }, [setSidebarShown]);
  const hideSidebar = useCallback(() => {
    setSidebarShown(false);
  }, [setSidebarShown]);
  const onToggleChange = useCallback(
    e => (e.target.checked ? setDarkTheme() : setLightTheme()),
    [setLightTheme, setDarkTheme],
  );

  useLockBodyScroll(sidebarShown);

  const logoLink = logo.href || baseUrl;
  const isExternalLogoLink = /http/.test(logoLink);
  const logoLinkProps = isExternalLogoLink
    ? {
        rel: 'noopener noreferrer',
        target: '_blank',
      }
    : null;
  const logoSrc = logo.srcDark && isDarkTheme ? logo.srcDark : logo.src;
  const logoImageUrl = useBaseUrl(logoSrc);

  return (
    <nav
      ref={forwardedRef}
      className={classnames('navbar', 'navbar--light', 'navbar--fixed-top', {
        'navbar-sidebar--show': sidebarShown,
        [styles.navbarHideable]: hideOnScroll,
        [styles.navbarHidden]: !isNavbarVisible,
      })}>
      <div className="navbar__inner">
        <div className="navbar__items">
          <div
            aria-label="Navigation bar toggle"
            className="navbar__toggle"
            role="button"
            tabIndex={0}
            onClick={showSidebar}
            onKeyDown={showSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              role="img"
              focusable="false">
              <title>Menu</title>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          </div>
          <Link className="navbar__brand" to={logoLink} {...logoLinkProps}>
            {logo != null && (
              <img
                key={isClient}
                className="navbar__logo"
                src={logoImageUrl}
                alt={logo.alt}
              />
            )}
            {title != null && (
              <strong
                className={isSearchBarExpanded ? styles.hideLogoText : ''}>
                {title}
              </strong>
            )}
          </Link>
          {links
            .filter(linkItem => linkItem.position !== 'right')
            .map((linkItem, i) => (
              <NavLink {...linkItem} key={i} />
            ))}
        </div>
        <div className="navbar__items navbar__items--right">
          {links
            .filter(linkItem => linkItem.position === 'right')
            .map((linkItem, i) => (
              <NavLink {...linkItem} key={i} />
            ))}
          {!disableDarkMode && (
            <Toggle
              className={styles.displayOnlyInLargeViewport}
              aria-label="Dark mode toggle"
              checked={isDarkTheme}
              onChange={onToggleChange}
            />
          )}
          <SearchBar
            handleSearchBarToggle={setIsSearchBarExpanded}
            isSearchBarExpanded={isSearchBarExpanded}
          />
        </div>
      </div>
      <div
        role="presentation"
        className="navbar-sidebar__backdrop"
        onClick={hideSidebar}
      />
      <div className="navbar-sidebar">
        <div className="navbar-sidebar__brand">
          <Link
            className="navbar__brand"
            onClick={hideSidebar}
            to={logoLink}
            {...logoLinkProps}>
            {logo != null && (
              <img
                key={isClient}
                className="navbar__logo"
                src={logoImageUrl}
                alt={logo.alt}
              />
            )}
            {title != null && <strong>{title}</strong>}
          </Link>
          {!disableDarkMode && sidebarShown && (
            <Toggle
              aria-label="Dark mode toggle in sidebar"
              checked={isDarkTheme}
              onChange={onToggleChange}
            />
          )}
        </div>
        <div className="navbar-sidebar__items">
          <div className="menu">
            <ul className="menu__list">
              {links.map((linkItem, i) => (
                <li className="menu__list-item" key={i}>
                  <NavLink
                    className="menu__link"
                    {...linkItem}
                    onClick={hideSidebar}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default withForwardedRef(Navbar);
