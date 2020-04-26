/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useLogo from '@theme/hooks/useLogo';

function NavItem({href, label, to, ...props}) {
  const toUrl = useBaseUrl(to);

  return (
    <li className="nav-item">
      <Link
        className="nav-link"
        {...(href
          ? {
              target: '_blank',
              rel: 'noopener noreferrer',
              href,
            }
          : {
              to: toUrl,
            })}
        {...props}>
        {label}
      </Link>
    </li>
  );
}

function Navbar() {
  const {
    siteConfig: {
      themeConfig: {navbar: {title, links = []} = {}},
    },
    isClient,
  } = useDocusaurusContext();

  const {logoLink, logoLinkProps, logoImageUrl, logoAlt} = useLogo();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-5">
      <Link className="navbar-brand" to={logoLink} {...logoLinkProps}>
        {logoImageUrl != null && (
          <img
            key={isClient}
            width="50"
            height="50"
            style={{
              maxWidth: '100%',
            }}
            src={logoImageUrl}
            alt={logoAlt}
          />
        )}
        {title != null && <span className="ml-2">{title}</span>}
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>

      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarNav">
        <ul className="navbar-nav">
          {links != null &&
            links.length !== 0 &&
            links
              .filter((linkItem) => linkItem.position === 'left')
              .map((linkItem, key) => <NavItem {...linkItem} key={key} />)}
        </ul>

        <ul className="navbar-nav">
          {links != null &&
            links.length !== 0 &&
            links
              .filter((linkItem) => linkItem.position === 'right')
              .map((linkItem, key) => <NavItem {...linkItem} key={key} />)}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
