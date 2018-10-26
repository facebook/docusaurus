/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import classnames from 'classnames';

import styles from './styles.css';

export default function SidebarCategory({
  label,
  items,
  subCategory,
  renderItem,
}) {
  const Heading = subCategory ? 'h4' : 'h3';

  return (
    <div
      className={classnames(styles.sidebarGroup, {
        [styles.sidebarSubGroup]: subCategory,
      })}
      key={label}>
      <Heading
        className={classnames(
          styles.sidebarItem,
          styles.sidebarGroupTitle,
          styles.sidebarGroupCategoryTitle,
        )}>
        {label}
      </Heading>

      <ul className={styles.sidebarList}>{items.map(renderItem)}</ul>
    </div>
  );
}
