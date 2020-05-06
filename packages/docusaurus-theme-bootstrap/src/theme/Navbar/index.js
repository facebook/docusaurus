/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useSidebarContext from '@theme/hooks/useSidebarContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useLogo from '@theme/hooks/useLogo';
import {
  Collapse,
  Navbar as NavbarBase,
  NavbarToggler,
  Nav,
  NavItem as NavItemBase,
  Button,
} from 'reactstrap';

const MOBILE_TOGGLE_SIZE = 24;

function NavItem({href, label, to, ...props}) {
  const toUrl = useBaseUrl(to);

  return (
    <NavItemBase>
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
    </NavItemBase>
  );
}

function Navbar() {
  const {
    siteConfig: {
      themeConfig: {navbar: {title, links = []} = {}},
    },
    isClient,
  } = useDocusaurusContext();

  const [navbarShown, setNavbarShown] = useState(false);
  const handleNavbarToggle = useCallback(() => {
    setNavbarShown(!navbarShown);
  }, [navbarShown, setNavbarShown]);
  const {handleSidebarToggle} = useSidebarContext();

  const {logoLink, logoLinkProps, logoImageUrl, logoAlt} = useLogo();

  return (
    <NavbarBase
      color="light"
      light
      expand="md"
      className="container-fluid mb-auto">
      <Button color="info" onClick={handleSidebarToggle} className="mr-2">
        <svg
          aria-label="Menu"
          xmlns="http://www.w3.org/2000/svg"
          height={MOBILE_TOGGLE_SIZE}
          width={MOBILE_TOGGLE_SIZE}
          viewBox="0 0 32 32"
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
      </Button>
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
