/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function SidebarLink({href, label}) {
  const isExternal = /^(https?:|\/\/)/.test(href);
  const Link = isExternal
    ? // eslint-disable-next-line jsx-a11y/anchor-has-content
      ({to, activeClassName, ...linkProps}) => <a {...linkProps} href={to} />
    : NavLink;

  return (
    <li className={styles.sidebarListItem}>
      <Link
        activeClassName={styles.sidebarLinkActive}
        className={classnames(styles.sidebarLink, styles.sidebarItem)}
        to={href}>
        {label}
      </Link>
    </li>
  );
}
