/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useLogo from '@theme/hooks/useLogo';
import {
  Collapse,
  Navbar as NavbarBase,
  NavbarToggler,
  Nav,
  NavItem as NavItemBase,
} from 'reactstrap';

function NavItem({
  activeBasePath,
  activeBaseRegex,
  href,
  label,
  to,
  activeClassName = 'nav-link text-info',
  prependBaseUrlToHref,
  ...props
}) {
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});

  return (
    <NavItemBase>
      <Link
        className="nav-link"
        {...(href
          ? {
              target: '_blank',
              rel: 'noopener noreferrer',
              href: prependBaseUrlToHref ? normalizedHref : href,
            }
          : {
              isNavLink: true,
              activeClassName,
              to: toUrl,
              ...(activeBasePath || activeBaseRegex
                ? {
                    isActive: (_match, location) =>
                      activeBaseRegex
                        ? new RegExp(activeBaseRegex).test(location.pathname)
                        : location.pathname.startsWith(activeBaseUrl),
                  }
                : null),
            })}
        {...props}>
        {label}
      </Link>
    </NavItemBase>
  );
}

function Navbar() {
  console.log(useDocusaurusContext());
  const {
    siteConfig: {
      themeConfig: {navbar: {title = '', items: links = []} = {}},
    },
    isClient,
  } = useDocusaurusContext();

  const [navbarShown, setNavbarShown] = useState(false);
  const handleNavbarToggle = useCallback(() => {
    setNavbarShown(!navbarShown);
  }, [navbarShown, setNavbarShown]);

  const {logoLink, logoLinkProps, logoImageUrl, logoAlt} = useLogo();

  return (
    <NavbarBase
      color="light"
      light
      expand="md"
      className="container-fluid mb-auto">
      <Link to={logoLink} {...logoLinkProps}>
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
      <NavbarToggler onClick={handleNavbarToggle} />
      <Collapse isOpen={navbarShown} navbar className="justify-content-between">
        <Nav navbar>
          {links != null &&
            links.length !== 0 &&
            links
              .filter((linkItem) => linkItem.position === 'left')
              .map((linkItem, key) => <NavItem {...linkItem} key={key} />)}
        </Nav>

        <Nav navbar>
          {links != null &&
            links.length !== 0 &&
            links
              .filter((linkItem) => linkItem.position === 'right')
              .map((linkItem, key) => <NavItem {...linkItem} key={key} />)}
        </Nav>
      </Collapse>
    </NavbarBase>
  );
}

export default Navbar;
