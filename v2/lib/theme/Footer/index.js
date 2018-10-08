import React from 'react';

import styles from './styles.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.footerRow}>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Docs</h3>
          <ul className={styles.footerList}>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                Getting Started
              </a>
            </li>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                Versioning
              </a>
            </li>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                Localization
              </a>
            </li>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                Adding Search
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Community</h3>
          <ul className={styles.footerList}>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                User Showcase
              </a>
            </li>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                Stack Overflow
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerColumnTitle}>Social</h3>
          <ul className={styles.footerList}>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                GitHub
              </a>
            </li>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                Facebook
              </a>
            </li>
            <li className={styles.footerListItem}>
              <a className={styles.footerLink} href="/">
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </section>
      <section className={styles.copyright}>
        <span>Copyright © {new Date().getFullYear()} Facebook Inc.</span>
      </section>
    </footer>
  );
}

export default Footer;
