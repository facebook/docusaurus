/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback, useEffect, useRef, memo} from 'react';
import clsx from 'clsx';
import {isSamePath, usePrevious} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/IconExternalLink';

import type {Props, DocSidebarItemsProps} from '@theme/DocSidebarItem';
import type {
  PropSidebarItemCategory,
  PropSidebarItemLink,
} from '@docusaurus/plugin-content-docs-types';

import styles from './styles.module.css';

const isActiveSidebarItem = (item: Props['item'], activePath: string) => {
  if (item.type === 'link') {
    return isSamePath(item.href, activePath);
  }
  if (item.type === 'category') {
    return item.items.some((subItem) =>
      isActiveSidebarItem(subItem, activePath),
    );
  }
  return false;
};

// Optimize sidebar at each "level"
// TODO this item should probably not receive the "activePath" props
// TODO this triggers whole sidebar re-renders on navigation
export const DocSidebarItems = memo(function DocSidebarItems({
  items,
  ...props
}: DocSidebarItemsProps): JSX.Element {
  return (
    <>
      {items.map((item, index) => (
        <DocSidebarItem
          key={index} // sidebar is static, the index does not change
          item={item}
          {...props}
        />
      ))}
    </>
  );
});

export default function DocSidebarItem({item, ...props}: Props): JSX.Element {
  switch (item.type) {
    case 'category':
      return <DocSidebarItemCategory item={item} {...props} />;
    case 'link':
    default:
      return <DocSidebarItemLink item={item} {...props} />;
  }
}

function DocSidebarItemCategory({
  item,
  onItemClick,
  collapsible,
  activePath,
  ...props
}: Props & {item: PropSidebarItemCategory}) {
  const {items, label} = item;

  const isActive = isActiveSidebarItem(item, activePath);
  const wasActive = usePrevious(isActive);

  // active categories are always initialized as expanded
  // the default (item.collapsed) is only used for non-active categories
  const [collapsed, setCollapsed] = useState(() => {
    if (!collapsible) {
      return false;
    }
    return isActive ? false : item.type === 'category' && item.collapsed;
  });

  const menuListRef = useRef<HTMLUListElement>(null);
  const [menuListHeight, setMenuListHeight] = useState<string | undefined>(
    undefined,
  );
  const handleMenuListHeight = (calc = true) => {
    setMenuListHeight(
      calc ? `${menuListRef.current?.scrollHeight}px` : undefined,
    );
  };

  // If we navigate to a category, it should automatically expand itself
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    if (justBecameActive && collapsed) {
      setCollapsed(false);
    }
  }, [isActive, wasActive, collapsed]);

  const handleItemClick = useCallback(
    (e) => {
      e.preventDefault();

      if (!menuListHeight) {
        handleMenuListHeight();
      }

      setTimeout(() => setCollapsed((state) => !state), 100);
    },
    [menuListHeight],
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <li
      className={clsx('menu__list-item', {
        'menu__list-item--collapsed': collapsed,
      })}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={clsx('menu__link', {
          'menu__link--sublist': collapsible,
          'menu__link--active': collapsible && isActive,
          [styles.menuLinkText]: !collapsible,
        })}
        onClick={collapsible ? handleItemClick : undefined}
        href={collapsible ? '#' : undefined}
        {...props}>
        {label}
      </a>
      <ul
        className="menu__list"
        ref={menuListRef}
        style={{
          height: menuListHeight,
        }}
        onTransitionEnd={() => {
          if (!collapsed) {
            handleMenuListHeight(false);
          }
        }}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          collapsible={collapsible}
          activePath={activePath}
        />
      </ul>
    </li>
  );
}

function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  collapsible: _collapsible,
  ...props
}: Props & {item: PropSidebarItemLink}) {
  const {href, label} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  return (
    <li className="menu__list-item" key={label}>
      <Link
        className={clsx('menu__link', {
          'menu__link--active': isActive,
        })}
        to={href}
        {...(isInternalUrl(href) && {
          isNavLink: true,
          exact: true,
          onClick: onItemClick,
        })}
        {...props}>
        {isInternalUrl(href) ? (
          label
        ) : (
          <span>
            {label}
            <IconExternalLink />
          </span>
        )}
      </Link>
    </li>
  );
}
