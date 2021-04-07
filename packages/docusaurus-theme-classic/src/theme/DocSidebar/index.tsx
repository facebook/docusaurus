/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import clsx from 'clsx';
import {useThemeConfig, isSamePath} from '@docusaurus/theme-common';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';
import useScrollPosition from '@theme/hooks/useScrollPosition';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import type {Props} from '@theme/DocSidebar';
import Logo from '@theme/Logo';
import IconArrow from '@theme/IconArrow';
import IconMenu from '@theme/IconMenu';
import {translate} from '@docusaurus/Translate';

import uniqueId from 'lodash/uniqueId';

import styles from './styles.module.css';

const MOBILE_TOGGLE_SIZE = 24;

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

function DocSidebarItemCategory({
  item,
  collapsible,
  activePath,
  ...props
}) {
  const {items, label} = item;
  const id = uniqueId('sidebar-category-');
  
  const isActive = isActiveSidebarItem(item, activePath);

  return (
    <li className={styles['drawer__list-item']} key={label}>
      <input
        type="checkbox"
        className={styles['drawer__checkbox-hack']}
        id={id}
        {...(isActive && {defaultChecked: true})}
      />
      <label htmlFor={id} className={styles.drawer__label} {...props}>
        <a
          className={clsx('menu__link', {
            'menu__link--sublist': collapsible,
            'menu__link--active': collapsible && isActive,
            [styles.menuLinkText]: !collapsible,
          })}
          {...props}
        >
          {label}
        </a>
      </label>
      <div className={styles['drawer__list-wrapper']}>
        <ul className={styles.drawer__list}>
          {items.map((childItem) => (
            <DocSidebarItem
              key={childItem.label}
              item={childItem}
              collapsible={collapsible}
              activePath={activePath}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

function DocSidebarItemLink({
  item,
  activePath,
  collapsible: _collapsible,
  ...props
}) {
  const {href, label} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternal = isInternalUrl(href);
  return (
    <li className={styles['drawer__list-item']} key={label}>
      <Link
        className={clsx('menu__link', {
          'menu__link--active': isActive,
          [styles.menuLinkExternal]: !!isInternal,
        })}
        to={href}
        {...(isInternalUrl(href) && {
          isNavLink: true,
          exact: true,
        })}
        {...props}
      >
        {label}
      </Link>
    </li>
  );
}

function DocSidebarItem(props): JSX.Element {
  switch (props.item.type) {
    case 'category':
      return <DocSidebarItemCategory {...props} />;
    case 'link':
    default:
      return <DocSidebarItemLink {...props} />;
  }
}

function ResponsiveMenuButton() {
  return (
    <>
      <input
        type="checkbox"
        id={styles['sidebar__responsive-button']}
        aria-label={
          translate({
            id: 'theme.docs.sidebar.responsiveButtonLabel',
            message: 'Toggle menu',
            description:
              'The ARIA label for toggle button of mobile doc sidebar',
          })
        }
      />
      <label
        htmlFor={styles['sidebar__responsive-button']}
        title={
          translate({
            id: 'theme.docs.sidebar.responsiveCloseButtonLabel',
            message: 'Close menu',
            description:
              'The title attribute for close button of mobile doc sidebar',
          })
        }
        className={clsx(
          'button button--secondary button--sm menu__button',
          styles['sidebar__menu-button'],
          styles['sidebar__menu-button--close'],
        )}
      >
        <span
          className={clsx(
            styles.sidebarMenuIcon,
            styles.sidebarMenuCloseIcon,
          )}
        >
          &times;
        </span>
      </label>
      <label
        htmlFor={styles['sidebar__responsive-button']}
        title={
          translate({
            id: 'theme.docs.sidebar.responsiveOpenButtonLabel',
            message: 'Open menu',
            description:
              'The title attribute for open button of mobile doc sidebar',
          })
        }
        className={clsx(
          'button button--secondary button--sm menu__button', 
          styles['sidebar__menu-button'],
          styles['sidebar__menu-button--open'],
        )}
      >
        <IconMenu
          className={styles.sidebarMenuIcon}
          height={MOBILE_TOGGLE_SIZE}
          width={MOBILE_TOGGLE_SIZE}
        />
      </label>
    </>
  )
}

function DocSidebar({
  path,
  sidebar,
  sidebarCollapsible = true,
  onCollapse,
  isHidden,
}: Props): JSX.Element | null {
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const {
    navbar: {hideOnScroll},
    hideableSidebar,
  } = useThemeConfig();
  const {isAnnouncementBarClosed} = useUserPreferencesContext();
  useScrollPosition(({scrollY}) => {
    setShowAnnouncementBar(scrollY === 0);
  })
  return (
    <div
      className={clsx(styles.sidebar, {
        [styles.sidebarWithHideableNavbar]: hideOnScroll,
        [styles.sidebarHidden]: isHidden,
      })}
    >
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <ResponsiveMenuButton />
      <div
        className={clsx(
          'menu',
          'menu--responsive',
          'thin-scrollbar',
          styles.menu,
          {[styles.menuWithAnnouncementBar]: !isAnnouncementBarClosed && showAnnouncementBar,},
        )}
      >
        <ul className={styles.drawer__list}>
          {sidebar.map((item) => (
            <DocSidebarItem
              key={item.label}
              item={item}
              collapsible={sidebarCollapsible}
              activePath={path}
            />
          ))}
        </ul>
      </div>
      {hideableSidebar && (
        <button
          type="button"
          title={translate({
            id: 'theme.docs.sidebar.collapseButtonTitle',
            message: 'Collapse sidebar',
            description:
              'The title attribute for collapse button of doc sidebar',
          })}
          aria-label={translate({
            id: 'theme.docs.sidebar.collapseButtonAriaLabel',
            message: 'Collapse sidebar',
            description:
              'The title attribute for collapse button of doc sidebar',
          })}
          className={clsx(
            'button button--secondary button--outline',
            styles.collapseSidebarButton,
          )}
          onClick={onCollapse}>
          <IconArrow className={styles.collapseSidebarButtonIcon} />
        </button>
      )}
    </div>
  );
}

export default DocSidebar;