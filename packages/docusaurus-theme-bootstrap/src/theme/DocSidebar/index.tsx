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
import {Props} from '@theme/DocSidebar';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs-types';

import styles from './styles.module.css';

type DocSidebarItemProps = {
  item: PropSidebarItem;
  onItemClick: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

const DocSidebarItem = ({
  item,
  onItemClick,
}: DocSidebarItemProps): JSX.Element => {
  if (item.type === 'category') {
    return item.items.length > 0 ? (
      <div>
        <h4 className="ml-2">{item.label}</h4>
        {item.items.map((childItem) => (
          <DocSidebarItem
            key={childItem.label}
            item={childItem}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    ) : (
      <></>
    );
  } else if (item.type === 'link') {
    return (
      <NavItem>
        <Link
          key={item.label}
          className="sidebar-item m-4 text-white"
          to={item.href}
          {...(isInternalUrl(item.href)
            ? {
                isNavLink: true,
                activeClassName: 'active',
                exact: true,
                onClick: onItemClick,
              }
            : {
                target: '_blank',
                rel: 'noreferrer noopener',
              })}>
          {item.label}
        </Link>
      </NavItem>
    );
  } else {
    return <></>;
  }
};

const DocSidebar = ({sidebar}: Props): JSX.Element => {
  const [sidebarShown, setSidebarShown] = useState(false);
  const handleSidebarToggle = useCallback(() => {
    setSidebarShown(!sidebarShown);
  }, [sidebarShown, setSidebarShown]);

  useLockBodyScroll(sidebarShown);

  return (
    <div className={classNames('bg-info', styles.sidebar)}>
      <div
        className={classNames('text-white', {
          [styles.isOpen]: sidebarShown,
        })}>
        <div className="d-flex w-100 justify-content-end mr-5">
          <Button
            color="secondary"
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
        <div className={classNames(styles.sideMenu)}>
          <Nav vertical className="list-unstyled p-3 mr-auto">
            {sidebar.map((item) => (
              <DocSidebarItem
                key={item.label}
                item={item}
                onItemClick={(e) => {
                  e.currentTarget.blur();
                  setSidebarShown(false);
                }}
              />
            ))}
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default DocSidebar;
