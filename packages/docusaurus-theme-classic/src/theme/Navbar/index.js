/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useCallback, useState} from 'react';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import withBaseUrl from '@docusaurus/withBaseUrl';

import SearchBar from '@theme/SearchBar';

import classnames from 'classnames';

function NavLink(props) {
  return (
    <Link
      className="navbar__item navbar__link"
      {...props}
      {...(props.href
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: props.href,
          }
        : {
            activeClassName: 'navbar__link--active',
            to: withBaseUrl(props.to),
          })}>
      {props.label}
    </Link>
  );
}

function Navbar() {
  const context = useDocusaurusContext();
  const [sidebarShown, setSidebarShown] = useState(false);
  const {siteConfig = {}} = context;
  const {baseUrl, themeConfig = {}} = siteConfig;
  const {algolia, navbar = {}} = themeConfig;
  const {title, logo, links = []} = navbar;

  const showSidebar = useCallback(() => {
    setSidebarShown(true);
  }, [setSidebarShown]);
  const hideSidebar = useCallback(() => {
    setSidebarShown(false);
  }, [setSidebarShown]);

  return (
    <nav
      className={classnames('navbar', 'navbar--light', 'navbar--fixed-top', {
        'navbar--sidebar-show': sidebarShown,
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
              <img
                className="navbar__logo"
                src={withBaseUrl(logo.src)}
                alt={logo.alt}
              />
            )}
            {title != null && <strong>{title}</strong>}
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
          {algolia && (
            <div className="navbar__search" key="search-box">
              <SearchBar />
            </div>
          )}
        </div>
      </div>
      <div
        role="presentation"
        className="navbar__sidebar__backdrop"
        onClick={() => {
          setSidebarShown(false);
        }}
      />
      <div className="navbar__sidebar">
        <div className="navbar__sidebar__brand">
          <a
            className="navbar__brand"
            href="#!"
            role="button"
            onClick={hideSidebar}>
            {logo != null && (
              <img
                className="navbar__logo"
                src={withBaseUrl(logo.src)}
                alt={logo.alt}
              />
            )}
            {title != null && <strong>{title}</strong>}
          </a>
        </div>
        <div className="navbar__sidebar__items">
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
}

export default Navbar;
