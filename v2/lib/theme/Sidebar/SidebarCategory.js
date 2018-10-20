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
