/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import classnames from 'classnames';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useAnnouncementBarContext from '@theme/hooks/useAnnouncementBarContext';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import useLogo from '@theme/hooks/useLogo';
import useScrollPosition from '@theme/hooks/useScrollPosition';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';

import styles from './styles.module.css';

const MOBILE_TOGGLE_SIZE = 24;

function DocSidebarItem({
  item,
  onItemClick,
  collapsible,
  activePath,
  ...props
}) {
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

  const handleItemClick = useCallback((e) => {
    e.preventDefault();
    e.target.blur();
    setCollapsed((state) => !state);
  });

  switch (type) {
    case 'category':
      return (
        items.length > 0 && (
          <li
            className={classnames('menu__list-item', {
              'menu__list-item--collapsed': collapsed,
            })}
            key={label}>
            <a
              className={classnames('menu__link', {
                'menu__link--sublist': collapsible,
                'menu__link--active': collapsible && !item.collapsed,
              })}
              href="#!"
              onClick={collapsible ? handleItemClick : undefined}
              {...props}>
              {label}
            </a>
            <ul className="menu__list">
              {items.map((childItem) => (
                <DocSidebarItem
                  tabIndex={collapsed ? '-1' : '0'}
                  key={childItem.label}
                  item={childItem}
                  onItemClick={onItemClick}
                  collapsible={collapsible}
                  activePath={activePath}
                />
              ))}
            </ul>
          </li>
        )
      );

    case 'link':
    default:
      return (
        <li className="menu__list-item" key={label}>
          <Link
            className={classnames('menu__link', {
              'menu__link--active': href === activePath,
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
}

// Calculate the category collapsing state when a page navigation occurs.
// We want to automatically expand the categories which contains the current page.
function mutateSidebarCollapsingState(item, path) {
  const {items, href, type} = item;
  switch (type) {
    case 'category': {
      const anyChildItemsActive =
        items
          .map((childItem) => mutateSidebarCollapsingState(childItem, path))
          .filter((val) => val).length > 0;
      // eslint-disable-next-line no-param-reassign
      item.collapsed = !anyChildItemsActive;
      return anyChildItemsActive;
    }

    case 'link':
    default:
      return href === path;
  }
}

function DocSidebar(props) {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);
  const {
    siteConfig: {
      themeConfig: {navbar: {title, hideOnScroll = false} = {}},
    } = {},
    isClient,
  } = useDocusaurusContext();
  const {logoLink, logoLinkProps, logoImageUrl, logoAlt} = useLogo();
  const {isAnnouncementBarClosed} = useAnnouncementBarContext();
  const {scrollY} = useScrollPosition();

  const {
    docsSidebars,
    path,
    sidebar: currentSidebar,
    sidebarCollapsible,
  } = props;

  useLockBodyScroll(showResponsiveSidebar);

  if (!currentSidebar) {
    return null;
  }

  const sidebarData = docsSidebars[currentSidebar];

  if (!sidebarData) {
    throw new Error(
      `Cannot find the sidebar "${currentSidebar}" in the sidebar config!`,
    );
  }

  if (sidebarCollapsible) {
    sidebarData.forEach((sidebarItem) =>
      mutateSidebarCollapsingState(sidebarItem, path),
    );
  }

  return (
    <div
      className={classnames(styles.sidebar, {
        [styles.sidebarWithHideableNavbar]: hideOnScroll,
      })}>
      {hideOnScroll && (
        <Link
          tabIndex="-1"
          className={styles.sidebarLogo}
          to={logoLink}
          {...logoLinkProps}>
          {logoImageUrl != null && (
            <img key={isClient} src={logoImageUrl} alt={logoAlt} />
          )}
          {title != null && <strong>{title}</strong>}
        </Link>
      )}
      <div
        className={classnames('menu', 'menu--responsive', styles.menu, {
          'menu--show': showResponsiveSidebar,
          [styles.menuWithAnnouncementBar]:
            !isAnnouncementBarClosed && scrollY === 0,
        })}>
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
              className={classnames(
                styles.sidebarMenuIcon,
                styles.sidebarMenuCloseIcon,
              )}>
              &times;
            </span>
          ) : (
            <svg
              aria-label="Menu"
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
          {sidebarData.map((item) => (
            <DocSidebarItem
              key={item.label}
              item={item}
              onItemClick={(e) => {
                e.target.blur();
                setShowResponsiveSidebar(false);
              }}
              collapsible={sidebarCollapsible}
              activePath={path}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DocSidebar;
