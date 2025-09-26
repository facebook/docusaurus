/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, type ReactNode, type ComponentProps} from 'react';
import clsx from 'clsx';
import {
  isRegexpStringMatch,
  useCollapsible,
  Collapsible,
} from '@docusaurus/theme-common';
import {isSamePath, useLocalPathname} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import NavbarNavLink from '@theme/NavbarItem/NavbarNavLink';
import NavbarItem, {type LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {Props} from '@theme/NavbarItem/DropdownNavbarItem/Mobile';
import styles from './styles.module.css';

function isItemActive(
  item: LinkLikeNavbarItemProps,
  localPathname: string,
): boolean {
  if (isSamePath(item.to, localPathname)) {
    return true;
  }
  if (isRegexpStringMatch(item.activeBaseRegex, localPathname)) {
    return true;
  }
  if (item.activeBasePath && localPathname.startsWith(item.activeBasePath)) {
    return true;
  }
  return false;
}

function containsActiveItems(
  items: readonly LinkLikeNavbarItemProps[],
  localPathname: string,
): boolean {
  return items.some((item) => isItemActive(item, localPathname));
}

function CollapseButton({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick: ComponentProps<'button'>['onClick'];
}) {
  return (
    <button
      aria-label={
        collapsed
          ? translate({
              id: 'theme.navbar.mobileDropdown.collapseButton.expandAriaLabel',
              message: 'Expand the dropdown',
              description:
                'The ARIA label of the button to expand the mobile dropdown navbar item',
            })
          : translate({
              id: 'theme.navbar.mobileDropdown.collapseButton.collapseAriaLabel',
              message: 'Collapse the dropdown',
              description:
                'The ARIA label of the button to collapse the mobile dropdown navbar item',
            })
      }
      aria-expanded={!collapsed}
      type="button"
      className="clean-btn menu__caret"
      onClick={onClick}
    />
  );
}

function useItemCollapsible({active}: {active: boolean}) {
  const {collapsed, toggleCollapsed, setCollapsed} = useCollapsible({
    initialState: () => !active,
  });

  // Expand if any item active after a navigation
  useEffect(() => {
    if (active) {
      setCollapsed(false);
    }
  }, [active, setCollapsed]);

  return {
    collapsed,
    toggleCollapsed,
  };
}

export default function DropdownNavbarItemMobile({
  items,
  className,
  position, // Need to destructure position from props so that it doesn't get passed on.
  onClick,
  ...props
}: Props): ReactNode {
  const localPathname = useLocalPathname();
  const isActive = isSamePath(props.to, localPathname);
  const containsActive = containsActiveItems(items, localPathname);

  const {collapsed, toggleCollapsed} = useItemCollapsible({
    active: isActive || containsActive,
  });

  // # hash permits to make the <a> tag focusable in case no link target
  // See https://github.com/facebook/docusaurus/pull/6003
  // There's probably a better solution though...
  const href = props.to ? undefined : '#';

  return (
    <li
      className={clsx('menu__list-item', {
        'menu__list-item--collapsed': collapsed,
      })}>
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isActive,
        })}>
        <NavbarNavLink
          role="button"
          className={clsx(
            styles.dropdownNavbarItemMobile,
            'menu__link menu__link--sublist',
            className,
          )}
          href={href}
          {...props}
          onClick={(e) => {
            // Prevent navigation when link is "#"
            if (href === '#') {
              e.preventDefault();
            }
            // Otherwise we let navigation eventually happen, and/or collapse
            toggleCollapsed();
          }}>
          {props.children ?? props.label}
        </NavbarNavLink>
        <CollapseButton
          collapsed={collapsed}
          onClick={(e) => {
            e.preventDefault();
            toggleCollapsed();
          }}
        />
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        {items.map((childItemProps, i) => (
          <NavbarItem
            mobile
            isDropdownItem
            onClick={onClick}
            activeClassName="menu__link--active"
            {...childItemProps}
            key={i}
          />
        ))}
      </Collapsible>
    </li>
  );
}
