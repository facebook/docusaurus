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

function DocLegacySidebar(props) {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);
  const {docsSidebars, sidebar} = props;

  if (!sidebar) {
    return null;
  }

  const thisSidebar = docsSidebars[sidebar];

  if (!thisSidebar) {
    throw new Error(`Can not find ${sidebar} config`);
  }

  const renderItem = item => {
    switch (item.type) {
      case 'category':
        return (
          <li className="menu__list-item" key={item.label}>
            <a className="menu__link" href="#!">
              {item.label}
            </a>
            <ul className="menu__list">{item.items.map(renderItem)}</ul>
          </li>
        );

      case 'link':
      default:
        return (
          <li className="menu__list-item" key={item.label}>
            <Link
              activeClassName="menu__link--active"
              className="menu__link"
              to={item.href}
              onClick={() => {
                setShowResponsiveSidebar(false);
              }}>
              {item.label}
            </Link>
          </li>
        );
    }
  };

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
          {thisSidebar.map(item => renderItem(item, {root: true}))}
        </ul>
      </div>
    </div>
  );
}

export default DocLegacySidebar;
