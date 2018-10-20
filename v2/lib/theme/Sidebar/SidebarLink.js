import React from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';

import styles from './styles.css';

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
