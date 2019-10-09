/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import classnames from 'classnames';

import Link from '@docusaurus/Link';

import styles from './styles.module.css';

const MOBILE_TOGGLE_SIZE = 24;

function DocSidebarItem({item, onItemClick}) {
  const {items, href, label, type} = item;
  const [collapsed, setCollapsed] = useState(item.collapsed);
  const [prevCollapsedProp, setPreviousCollapsedProp] = useState(null);

  // If the collapsing state from props changed, probably a navigation event
  // occurred. Overwrite the component's collapsed state with the props'
  // collapsed value.
  if (item.collapsed !== prevCollapsedProp) {
    setPreviousCollapsedProp(item.collapsed);
    setCollapsed(item.collapsed);
  }

  switch (type) {
    case 'category':
      return (
        <li
          className={classnames('menu__list-item', {
            'menu__list-item--collapsed': collapsed,
          })}
          key={label}>
          <a
            className={classnames('menu__link', 'menu__link--sublist', {
              'menu__link--active': !item.collapsed,
            })}
            href="#!"
            onClick={() => setCollapsed(!collapsed)}>
            {label}
          </a>
          <ul className="menu__list">
            {items.map(childItem => (
              <DocSidebarItem
                key={childItem.label}
                item={childItem}
                onItemClick={onItemClick}
              />
            ))}
          </ul>
        </li>
      );

    case 'link':
    default:
      return (
        <li className="menu__list-item" key={label}>
          <Link
            activeClassName="menu__link--active"
            className="menu__link"
            to={href}
            onClick={onItemClick}>
            {label}
          </Link>
        </li>
      );
  }
}

// Calculate the category collapsing state when a page navigation occurs.
// We want to automatically expand the categories which contains the current page.
function mutateSidebarCollapsingState(item, location) {
  const {items, href, type} = item;
  switch (type) {
    case 'category': {
      const anyChildItemsActive =
        items
          .map(childItem => mutateSidebarCollapsingState(childItem, location))
          .filter(val => val).length > 0;
      // eslint-disable-next-line no-param-reassign
      item.collapsed = !anyChildItemsActive;
      return anyChildItemsActive;
    }

    case 'link':
    default:
      return (
        href === location.pathname ||
        href === location.pathname.replace(/\/$/, '')
      );
  }
}

function DocLegacySidebar(props) {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);

  const {docsSidebars, location, sidebar: currentSidebar} = props;

  if (!currentSidebar) {
    return null;
  }

  const sidebarData = docsSidebars[currentSidebar];

  if (!sidebarData) {
    throw new Error(`Can not find ${currentSidebar} config`);
  }

  sidebarData.forEach(sidebarItem =>
    mutateSidebarCollapsingState(sidebarItem, location),
  );

  return (
    <div className={styles.sidebar}>
      <div
        className={classnames('menu', 'menu--responsive', {
          'menu--show': showResponsiveSidebar,
        })}>
        <button
          aria-label={showResponsiveSidebar ? 'Close Menu' : 'Open Menu'}
          className="button button--secondary button--sm menu__button"
          type="button"
          onClick={() => {
            setShowResponsiveSidebar(!showResponsiveSidebar);
          }}>
          {showResponsiveSidebar ? (
            <span
              className={classnames(
                styles.sidebarMenuIcon,
                styles.sidebarMenuCloseIcon,
              )}>
              &times;
            </span>
          ) : (
            <svg
              className={styles.sidebarMenuIcon}
              xmlns="http://www.w3.org/2000/svg"
              height={MOBILE_TOGGLE_SIZE}
              width={MOBILE_TOGGLE_SIZE}
              viewBox="0 0 32 32"
              role="img"
              focusable="false">
              <title>Menu</title>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
                d="M4 7h22M4 15h22M4 23h22"
              />
            </svg>
          )}
        </button>
        <ul className="menu__list">
          {sidebarData.map(item => (
            <DocSidebarItem
              key={item.label}
              item={item}
              onItemClick={() => {
                setShowResponsiveSidebar(false);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DocLegacySidebar;
