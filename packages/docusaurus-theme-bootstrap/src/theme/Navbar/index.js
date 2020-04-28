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
  NavbarBrand,
  Nav,
  NavItem as NavItemBase,
} from 'reactstrap';

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

  const [sidebarShown, setSidebarShown] = useState(false);
  const handleToggle = useCallback(() => {
    setSidebarShown(!sidebarShown);
  }, [sidebarShown, setSidebarShown]);
  const {logoLink, logoLinkProps, logoImageUrl, logoAlt} = useLogo();

  return (
    <NavbarBase color="light" light expand="md">
      <NavbarBrand>
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
      </NavbarBrand>

      <NavbarToggler onClick={handleToggle} />
      <Collapse
        isOpen={sidebarShown}
        navbar
        className="justify-content-between">
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
