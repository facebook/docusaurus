/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useEffect, useRef, useCallback} from 'react';
import clsx from 'clsx';
import {useThemeConfig, isSamePath} from '@docusaurus/theme-common';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import useWindowSize, {windowSizes} from '@theme/hooks/useWindowSize';
import useScrollPosition from '@theme/hooks/useScrollPosition';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import type {Props} from '@theme/DocSidebar';
import {
  PropSidebarItem,
  PropSidebarItemCategory,
} from '@docusaurus/plugin-content-docs-types';
import Logo from '@theme/Logo';
import IconArrow from '@theme/IconArrow';
import IconMenu from '@theme/IconMenu';

import styles from './styles.module.css';

const MOBILE_TOGGLE_SIZE = 24;

function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const isActiveSidebarItem = (item, activePath) => {
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

type CollapseMap = Record<string, boolean | undefined>;

const createInitialStates = (
  items: readonly PropSidebarItem[],
): CollapseMap => {
  const map: Record<string, boolean | undefined> = {};
  items.forEach((childItem: PropSidebarItem) => {
    const itemType = childItem.type;
    const itemLabel = childItem.label;
    if (itemType === 'category') {
      map[itemLabel] = (childItem as PropSidebarItemCategory).collapsed;
    } else {
      map[itemLabel] = false;
    }
  });
  return map;
};

const createCollapseHandler = (
  currStates: CollapseMap,
  setStates: (items: CollapseMap) => void,
  currLabel: string,
) => {
  return (isCollapsed: boolean) => {
    const states = {...currStates};
    Object.keys(states).forEach((label: string) => {
      if (currLabel === label) {
        states[label] = isCollapsed;
      } else if (!isCollapsed) {
        states[label] = true;
      }
    });
    setStates(states);
  };
};

function DocSidebarItemCategory({
  item,
  onItemClick,
  collapsible,
  collapsed,
  setCollapsed,
  activePath,
  autoCollapse,
  ...props
}) {
  const {items, label} = item;

  const isActive = isActiveSidebarItem(item, activePath);
  const wasActive = usePrevious(isActive);
  const isCollapsed = isActive ? false : collapsed;

  const menuListRef = useRef<HTMLUListElement>(null);
  const [menuListHeight, setMenuListHeight] = useState<string | undefined>(
    undefined,
  );

  const [collapsedStates, setCollapsedStates] = useState<CollapseMap>(
    createInitialStates(items),
  );

  const handleMenuListHeight = (calc = true) => {
    setMenuListHeight(
      calc ? `${menuListRef.current?.scrollHeight}px` : undefined,
    );
  };

  // If we navigate to a category, it should automatically expand itself
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    if (justBecameActive && isCollapsed) {
      setCollapsed(false);
    }
  }, [isActive, wasActive, isCollapsed]);

  const handleItemClick = useCallback(
    async (e) => {
      e.preventDefault();

      if (!menuListHeight) {
        handleMenuListHeight();
      }

      setCollapsed(!collapsed);
    },
    [menuListHeight],
  );
  if (items.length === 0) {
    return null;
  }

  return (
    <li
      className={clsx('menu__list-item', {
        'menu__list-item--collapsed': isCollapsed,
      })}
      key={label}>
      <a
        className={clsx('menu__link', {
          'menu__link--sublist': collapsible,
          'menu__link--active': collapsible && isActive,
          [styles.menuLinkText]: !collapsible,
        })}
        onClick={collapsible ? handleItemClick : undefined}
        href={collapsible ? '#!' : undefined}
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
          if (!isCollapsed) {
            handleMenuListHeight(false);
          }
        }}>
        {items.map((childItem) => {
          const setItemCollapsed = createCollapseHandler(
            collapsedStates,
            setCollapsedStates,
            childItem.label,
          );
          return (
            <DocSidebarItem
              tabIndex={collapsed ? '-1' : '0'}
              key={childItem.label}
              item={childItem}
              autoCollapse={autoCollapse}
              parent={items}
              collapsed={collapsedStates[childItem.label]}
              setCollapsed={setItemCollapsed}
              onItemClick={onItemClick}
              collapsible={collapsible}
              activePath={activePath}
            />
          );
        })}
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
}) {
  const {href, label} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  return (
    <li className="menu__list-item" key={label}>
      <Link
        className={clsx('menu__link', {
          'menu__link--active': isActive,
        })}
        to={href}
        {...(isInternalUrl(href)
          ? {
              isNavLink: true,
              exact: true,
              onClick: onItemClick,
            }
          : {
              target: '_blank',
              rel: 'noreferrer noopener',
            })}
        {...props}>
        {label}
      </Link>
    </li>
  );
}

function DocSidebarItem(props) {
  switch (props.item.type) {
    case 'category':
      return <DocSidebarItemCategory {...props} />;
    case 'link':
    default:
      return <DocSidebarItemLink {...props} />;
  }
}

function DocSidebar({
  path,
  sidebar,
  sidebarCollapsible = true,
  autoCollapseSidebar,
  onCollapse,
  isHidden,
}: Props): JSX.Element | null {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);
  const {
    navbar: {hideOnScroll},
    hideableSidebar,
  } = useThemeConfig();
  const {isAnnouncementBarClosed} = useUserPreferencesContext();
  const {scrollY} = useScrollPosition();

  useLockBodyScroll(showResponsiveSidebar);
  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize === windowSizes.desktop) {
      setShowResponsiveSidebar(false);
    }
  }, [windowSize]);

  const [collapsedStates, setCollapsedStates] = useState<CollapseMap>(
    createInitialStates(sidebar),
  );

  return (
    <div
      className={clsx(styles.sidebar, {
        [styles.sidebarWithHideableNavbar]: hideOnScroll,
        [styles.sidebarHidden]: isHidden,
      })}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <div
        className={clsx(
          'menu',
          'menu--responsive',
          'thin-scrollbar',
          styles.menu,
          {
            'menu--show': showResponsiveSidebar,
            [styles.menuWithAnnouncementBar]:
              !isAnnouncementBarClosed && scrollY === 0,
          },
        )}>
        <button
          aria-label={showResponsiveSidebar ? 'Close Menu' : 'Open Menu'}
          aria-haspopup="true"
          className="button button--secondary button--sm menu__button"
          type="button"
          onClick={() => {
            setShowResponsiveSidebar(!showResponsiveSidebar);
          }}>
          {showResponsiveSidebar ? (
            <span
              className={clsx(
                styles.sidebarMenuIcon,
                styles.sidebarMenuCloseIcon,
              )}>
              &times;
            </span>
          ) : (
            <IconMenu
              className={styles.sidebarMenuIcon}
              height={MOBILE_TOGGLE_SIZE}
              width={MOBILE_TOGGLE_SIZE}
            />
          )}
        </button>
        <ul className="menu__list">
          {sidebar.map((item) => {
            const setItemCollapsed = createCollapseHandler(
              collapsedStates,
              setCollapsedStates,
              item.label,
            );
            return (
              <DocSidebarItem
                key={item.label + collapsedStates[item.label]}
                item={item}
                onItemClick={(e) => {
                  e.target.blur();
                  setShowResponsiveSidebar(false);
                }}
                collapsed={collapsedStates[item.label]}
                setCollapsed={setItemCollapsed}
                collapsible={sidebarCollapsible}
                parent={sidebar}
                autoCollapse={autoCollapseSidebar}
                activePath={path}
              />
            );
          })}
        </ul>
      </div>
      {hideableSidebar && (
        <button
          type="button"
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
          className={clsx(
            'button button--secondary button--outline',
            styles.collapseSidebarButton,
          )}
          onClick={onCollapse}>
          <IconArrow
            className={styles.collapseSidebarButtonIcon}
            aria-label="Collapse sidebar"
          />
        </button>
      )}
    </div>
  );
}

export default DocSidebar;
