import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

function DocSidebarItem({ item, ...props }) {
  const { label, customProps: { image } = {} } = item;

  return (
    <li className={clsx('menu__list-item', styles.docSidebarItem)}>
      {image && (
        <img src={image} alt={label} className={styles.docSidebarItemIcon} />
      )}
      <a className="menu__link" href={item.href} {...props}>
        {label}
      </a>
    </li>
  );
}

export default DocSidebarItem;