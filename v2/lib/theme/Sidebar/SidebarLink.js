/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import classnames from 'classnames';

import styles from './styles.module.css';

export default function SidebarLink({href, label}) {
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
