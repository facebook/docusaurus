/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';

import {
  Collapse,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from 'reactstrap';

const MOBILE_TOGGLE_SIZE = 24;

const DocSidebarItem = ({item, onItemClick, collapsible, ...props}) => {
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
          <Dropdown
            isOpen={collapsed}
            key={label}
            toggle={collapsible ? handleItemClick : undefined}>
            <DropdownToggle caret>{label}</DropdownToggle>
            <DropdownMenu>
              {items.map((childItem) => (
                <DropdownItem key={childItem.label}>
                  <DocSidebarItem
                    tabIndex={collapsed ? '-1' : '0'}
                    item={childItem}
                    onItemClick={onItemClick}
                    collapsible={collapsible}
                  />
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )
      );

    case 'link':
    default:
      return (
        <li className="menu__list-item" key={label}>
          <Link
            className="menu__link"
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
        </li>
      );
  }
};

const DocSidebar = (props) => {
  const [sidebarShown, setSidebarShown] = useState(false);
  const handleToggle = useCallback(() => {
    setSidebarShown(!sidebarShown);
  }, [sidebarShown, setSidebarShown]);
  const {
    siteConfig: {themeConfig: {navbar: {title} = {}}} = {},
  } = useDocusaurusContext();
  const {
    docsSidebars,
    path,
    sidebar: currentSidebar,
    sidebarCollapsible,
  } = props;

  if (!currentSidebar) {
    return null;
  }

  const sidebarData = docsSidebars[currentSidebar];
  console.log(sidebarData);

  if (!sidebarData) {
    throw new Error(
      `Cannot find the sidebar "${currentSidebar}" in the sidebar config!`,
    );
  }

  return (
    <div>
      <Button
        color="primary"
        onClick={handleToggle}
        style={{marginBottom: '1rem'}}>
        <svg
          aria-label="Menu"
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
      </Button>
      <Collapse isOpen={sidebarShown}>
        <ul className="menu__list">
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
        </ul>
      </Collapse>
    </div>
  );
};

export default DocSidebar;
