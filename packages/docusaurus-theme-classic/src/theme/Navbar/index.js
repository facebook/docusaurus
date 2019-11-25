/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useState, useEffect} from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import SearchBar from '@theme/SearchBar';
import Toggle from '@theme/Toggle';

import classnames from 'classnames';

import useTheme from '@theme/hooks/useTheme';

import styles from './styles.module.css';

function NavLink({to, href, label, position, ...props}) {
  const toUrl = useBaseUrl(to);
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
          })}
      {...props}>
      {label}
    </Link>
  );
}

function Navbar() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {baseUrl, themeConfig = {}} = siteConfig;
  const {navbar = {}, disableDarkMode = false} = themeConfig;
  const {title, logo = {}, links = [], hideOnScroll = false} = navbar;
  const [sidebarShown, setSidebarShown] = useState(false);
  const [isSearchBarExpanded, setIsSearchBarExpanded] = useState(false);
  const [theme, setTheme] = useTheme();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useCallback(node => {
    if (node !== null) {
      setNavbarHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const showSidebar = useCallback(() => {
    setSidebarShown(true);
  }, [setSidebarShown]);
  const hideSidebar = useCallback(() => {
    setSidebarShown(false);
  }, [setSidebarShown]);

  const onToggleChange = useCallback(
    e => setTheme(e.target.checked ? 'dark' : ''),
    [setTheme],
  );

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - navbarHeight;
    const windowHeight = window.innerHeight;

    if (scrollTop < navbarHeight) {
      return;
    }

    if (lastScrollTop && scrollTop > lastScrollTop) {
      setIsNavbarVisible(false);
    } else if (scrollTop + windowHeight < documentHeight) {
      setIsNavbarVisible(true);
    }

    setLastScrollTop(scrollTop);
  };

  useEffect(() => {
    if (!hideOnScroll) {
      return undefined;
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop, navbarHeight]);

  const logoUrl = useBaseUrl(logo.src);
  return (
    <>
      <Head>
        {/* TODO: Do not assume that it is in english language */}
        <html lang="en" data-theme={theme} />
      </Head>
      <nav
        ref={navbarRef}
        className={classnames('navbar', 'navbar--light', 'navbar--fixed-top', {
          'navbar-sidebar--show': sidebarShown,
          [styles.navbarHidable]: hideOnScroll,
          [styles.navbarHided]: !isNavbarVisible,
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
            <Link className="navbar__brand" to={baseUrl}>
              {logo != null && (
                <img className="navbar__logo" src={logoUrl} alt={logo.alt} />
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
                checked={theme === 'dark'}
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
          onClick={() => {
            setSidebarShown(false);
          }}
        />
        <div className="navbar-sidebar">
          <div className="navbar-sidebar__brand">
            <Link className="navbar__brand" onClick={hideSidebar} to={baseUrl}>
              {logo != null && (
                <img className="navbar__logo" src={logoUrl} alt={logo.alt} />
              )}
              {title != null && <strong>{title}</strong>}
            </Link>
            {!disableDarkMode && sidebarShown && (
              <Toggle
                aria-label="Dark mode toggle in sidebar"
                checked={theme === 'dark'}
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
    </>
  );
}

export default Navbar;
