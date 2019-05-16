/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import SearchBar from '@theme/SearchBar';

function Navbar() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const {
    baseUrl,
    headerIcon,
    themeConfig: {algolia, headerLinks = []},
    title,
    disableHeaderTitle,
  } = siteConfig;

  // function to generate each header link
  const makeLinks = link => {
    if (link.url) {
      // internal link
      const targetLink = `${baseUrl}${link.url}`;
      return (
        <div key={targetLink} className="navbar__item">
          <Link
            activeClassName="navbar__link--active"
            className="navbar__link"
            to={targetLink}>
            {link.label}
          </Link>
        </div>
      );
    }

    if (link.href) {
      // Set link to specified href.
      return (
        <div key={link.label} className="navbar__item">
          <Link to={link.href} className="navbar__link">
            {link.label}
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <nav className="navbar navbar--light navbar--fixed-top">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link className="navbar__brand" to={baseUrl}>
            {headerIcon && (
              <img
                className="navbar__logo"
                src={baseUrl + headerIcon}
                alt={title}
              />
            )}
            {!disableHeaderTitle && <strong>{title}</strong>}
          </Link>
          {headerLinks.map(makeLinks)}
        </div>
        <div className="navbar__items navbar__items--right">
          {algolia && (
            <div className="navbar__search" key="search-box">
              <SearchBar />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
