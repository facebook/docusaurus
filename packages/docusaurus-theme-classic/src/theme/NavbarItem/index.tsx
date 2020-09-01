/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import type {Props} from '@theme/NavbarItem';

const NavbarItemComponents = {
  default: () => DefaultNavbarItem,

  // Need to lazy load these items as we don't know for sure the docs plugin is loaded
  // See https://github.com/facebook/docusaurus/issues/3360
  docsVersion: () =>
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@theme/NavbarItem/DocsVersionNavbarItem').default,
  docsVersionDropdown: () =>
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('@theme/NavbarItem/DocsVersionDropdownNavbarItem').default,
} as const;

const getNavbarItemComponent = (
  type: keyof typeof NavbarItemComponents = 'default',
) => {
  const navbarItemComponent = NavbarItemComponents[type];
  if (!navbarItemComponent) {
    throw new Error(`No NavbarItem component found for type=${type}.`);
  }
  return navbarItemComponent();
};

export default function NavbarItem({type, ...props}: Props): JSX.Element {
  const NavbarItemComponent = getNavbarItemComponent(type);
  return <NavbarItemComponent {...props} />;
}
