/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DocsVersionNavbarItem from '@theme/NavbarItem/DocsVersionNavbarItem';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DocsVersionDropdownNavbarItem from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';

const NavbarItemComponents = {
  default: DefaultNavbarItem,
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
};

const getNavbarItemComponent = (type: string = 'default') => {
  const NavbarItemComponent = NavbarItemComponents[type];
  if (!NavbarItemComponent) {
    throw new Error(`No NavbarItem component found for type=${type}.`);
  }
  return NavbarItemComponent;
};

export default function NavbarItem({type, ...props}) {
  const NavbarItemComponent = getNavbarItemComponent(type);
  return <NavbarItemComponent {...props} />;
}
