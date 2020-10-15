/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogPostPage';
import styles from './styles.module.css';

export default function BlogSidebar({sidebar}: {sidebar: Props['sidebar']}) {
  return (
    <div className={styles.sidebar}>
      <h3 style={{marginBottom: 0}}>All blog posts</h3>
      <ul className={styles.sidebarItemList}>
        {sidebar.map((item) => {
          return (
            <li key={item.permalink} className={styles.sidebarItem}>
              <Link to={item.permalink}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
