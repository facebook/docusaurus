/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useSidebarContext from '@theme/hooks/useSidebarContext';
import {NavItem, Nav} from 'reactstrap';
import classNames from 'classnames';

import './index.css';

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
                onItemClick={onItemClick}
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
            className="sidebar-item m-4"
            to={href}
            {...(isInternalUrl(href)
              ? {
                  isNavLink: true,
                  activeClassName: 'menu__link--active',
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
  const {
    handleSidebarToggle,
    sidebarShown,
    setSidebarShown,
  } = useSidebarContext();

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
    <div className={classNames('sidebar', {'is-open': sidebarShown})}>
      <div className="sidebar-header">
        <button
          color="info"
          type="button"
          onClick={handleSidebarToggle}
          style={{color: '#fff'}}>
          &times;
        </button>
      </div>
      <div className="side-menu">
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
    </div>
  );
};

export default DocSidebar;
