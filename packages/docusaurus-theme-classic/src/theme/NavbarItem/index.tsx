/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem, {
  Props as DropdownNavbarItemProps,
} from '@theme/NavbarItem/DropdownNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import type {Types, Props} from '@theme/NavbarItem';

const NavbarItemComponents: Record<
  Exclude<Types, undefined>,
  // TODO: properly type this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => (props: any) => JSX.Element
> = {
  default: () => DefaultNavbarItem,
  localeDropdown: () => LocaleDropdownNavbarItem,
  search: () => SearchNavbarItem,
  dropdown: () => DropdownNavbarItem,

  // Need to lazy load these items as we don't know for sure the docs plugin is loaded
  // See https://github.com/facebook/docusaurus/issues/3360
  /* eslint-disable @typescript-eslint/no-var-requires, global-require */
  docsVersion: () => require('@theme/NavbarItem/DocsVersionNavbarItem').default,
  docsVersionDropdown: () =>
    require('@theme/NavbarItem/DocsVersionDropdownNavbarItem').default,
  doc: () => require('@theme/NavbarItem/DocNavbarItem').default,
  /* eslint-enable @typescript-eslint/no-var-requires, global-require */
} as const;

type NavbarItemComponentType = keyof typeof NavbarItemComponents;

const getNavbarItemComponent = (type: NavbarItemComponentType) => {
  const navbarItemComponentFn = NavbarItemComponents[type];
  if (!navbarItemComponentFn) {
    throw new Error(`No NavbarItem component found for type "${type}".`);
  }
  return navbarItemComponentFn();
};

function getComponentType(
  type: Types,
  isDropdown: boolean,
): NavbarItemComponentType {
  // Backward compatibility: navbar item with no type set
  // but containing dropdown items should use the type "dropdown"
  if (!type || type === 'default') {
    return isDropdown ? 'dropdown' : 'default';
  }
  return type as NavbarItemComponentType;
}

export const getInfimaActiveClassName = (mobile?: boolean): string =>
  mobile ? 'menu__link--active' : 'navbar__link--active';

export default function NavbarItem({type, ...props}: Props): JSX.Element {
  const componentType = getComponentType(
    type,
    (props as DropdownNavbarItemProps).items !== undefined,
  );
  const NavbarItemComponent = getNavbarItemComponent(componentType);
  return <NavbarItemComponent {...props} />;
}
