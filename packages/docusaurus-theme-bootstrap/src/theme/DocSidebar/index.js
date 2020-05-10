/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import {NavItem, Nav, Button} from 'reactstrap';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import classNames from 'classnames';

import styles from './styles.module.css';

const DocSidebarItem = ({item, onItemClick, collapsible, ...props}) => {
  const {items, href, label, type} = item;

  switch (type) {
    case 'category':
      return (
        items.length > 0 && (
          <div>
            <h4 className="ml-2">{label}</h4>
            {items.map((childItem) => (
              <DocSidebarItem
                key={childItem.label}
                item={childItem}
                onItemClick={collapsible ? onItemClick : undefined}
              />
            ))}
          </div>
        )
      );

    case 'link':
    default:
      return (
        <NavItem>
          <Link
            key={label}
            className="sidebar-item m-4 text-white"
            to={href}
            {...(isInternalUrl(href)
              ? {
                  isNavLink: true,
                  activeClassName: 'active',
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
        </NavItem>
      );
  }
};

const DocSidebar = (props) => {
  const {docsSidebars, sidebar: currentSidebar, sidebarCollapsible} = props;
  const [sidebarShown, setSidebarShown] = useState(true);
  const handleSidebarToggle = useCallback(() => {
    setSidebarShown(!sidebarShown);
  }, [sidebarShown, setSidebarShown]);

  useLockBodyScroll(sidebarShown);

  if (!currentSidebar) {
    return null;
  }

  const sidebarData = docsSidebars[currentSidebar];

  if (!sidebarData) {
    throw new Error(
      `Cannot find the sidebar "${currentSidebar}" in the sidebar config!`,
    );
  }

  return (
    <div
      className={classNames('bg-info text-white', styles.sidebar, {
        [styles.isOpen]: sidebarShown,
      })}>
      <div className={styles.sidebarHeader}>
        <button
          color="info"
          type="button"
          onClick={handleSidebarToggle}
          style={{color: '#fff'}}>
          &times;
        </button>
      </div>
      <div className={styles.sideMenu}>
        <Nav vertical className="list-unstyled pb-3 mr-auto">
          {sidebarData.map((item) => (
            <DocSidebarItem
              key={item.label}
              item={item}
              onItemClick={(e) => {
                e.target.blur();
                setSidebarShown(false);
              }}
              collapsible={sidebarCollapsible}
            />
          ))}
        </Nav>
      </div>
      <div className="d-flex w-100 justify-content-end mr-5">
        <Button
          color="primary"
          onClick={handleSidebarToggle}
          className={classNames('mr-2', styles.sidebarFAB)}>
          <svg
            aria-label="Menu"
            xmlns="http://www.w3.org/2000/svg"
            height={24}
            width={24}
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
        </Button>
      </div>
    </div>
  );
};

export default DocSidebar;
