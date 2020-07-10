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

const SpecialNavbarItemsByType = {
  docsVersion: DocsVersionNavbarItem,
  docsVersionDropdown: DocsVersionDropdownNavbarItem,
};

function NavbarItem({type, ...props}) {
  const CustomNavItemComponent = SpecialNavbarItemsByType[type];
  if (CustomNavItemComponent) {
    return <CustomNavItemComponent {...props} />;
  }
  return <DefaultNavbarItem {...props} />;
}

export default NavbarItem;
