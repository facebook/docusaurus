import React from 'react';
import {NavLink} from 'react-router-dom';

import styles from './styles.css';

function Navbar(props) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <ul className={styles.navList}>
          <li className={styles.navListItem}>
            <NavLink className={styles.navBrand} to="/">
              <img
                alt="Docusaurus Logo"
                className={styles.navLogo}
                src="/img/docusaurus-logo.svg"
              />
              <strong>Docusaurus</strong>
            </NavLink>
          </li>
          {Object.values(props.docsMetadatas).map(metadata => (
            <li key={metadata.permalink} className={styles.navListItem}>
              <NavLink
                activeClassName={styles.navLinkActive}
                className={styles.navLink}
                to={metadata.permalink}>
                {metadata.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
