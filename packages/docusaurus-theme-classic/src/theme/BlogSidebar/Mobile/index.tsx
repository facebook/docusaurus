/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import {useVisibleBlogSidebarItems} from '@docusaurus/theme-common/internal';
import {NavbarSecondaryMenuFiller} from '@docusaurus/theme-common';
import type {Props} from '@theme/BlogSidebar/Mobile';

function BlogSidebarMobileSecondaryMenu({sidebar}: Props): JSX.Element {
  const items = useVisibleBlogSidebarItems(sidebar.items);
  return (
    <ul className="menu__list">
      {items.map((item) => (
        <li key={item.permalink} className="menu__list-item">
          <Link
            isNavLink
            to={item.permalink}
            className="menu__link"
            activeClassName="menu__link--active">
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function BlogSidebarMobile(props: Props): JSX.Element {
  return (
    <NavbarSecondaryMenuFiller
      component={BlogSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}
