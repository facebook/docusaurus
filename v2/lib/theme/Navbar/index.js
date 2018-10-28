import React from 'react';
import {NavLink} from 'react-router-dom';

import Search from '@theme/Search';
import styles from './styles.module.css';

function Navbar(props) {
  const {siteConfig = {}, env = {}, metadata = {}, docsMetadatas = {}} = props;
  const {baseUrl, headerLinks, headerIcon, algolia} = siteConfig;
  const {language: thisLanguage, version: thisVersion} = metadata;

  const translationEnabled = env.translation.enabled;
  const versioningEnabled = env.versioning.enabled;

  // function to generate each header link
  const makeLinks = link => {
    if (link.search && algolia) {
      // return algolia search bar
      return (
        <li className={styles.navListItem} key="search-box">
          <Search {...props} />
        </li>
      );
    }
    if (link.languages) {
      // TODO in the future for <LanguageDropdown /> like in v1
      return null;
    }
    if (link.doc) {
      // set link to document with current page's language/version
      const langPart = translationEnabled ? `${thisLanguage}-` : '';
      const versionPart =
        versioningEnabled && thisVersion !== 'next'
          ? `version-${thisVersion || env.versioning.defaultVersion}-`
          : '';
      const id = langPart + versionPart + link.doc;
      if (!docsMetadatas[id]) {
        const errorStr = `We could not find the doc wih id: ${id}. Please check your headerLinks correctly\n`;
        throw new Error(errorStr);
      }
      return (
        <li key={link.doc} className={styles.navListItem}>
          <NavLink
            activeClassName={styles.navLinkActive}
            className={styles.navLink}
            to={docsMetadatas[id].permalink}>
            {link.label}
          </NavLink>
        </li>
      );
    }
    if (link.page) {
      // set link to page with current page's language if appropriate
      const pageHref = `${baseUrl}${thisLanguage ? `${thisLanguage}/` : ''}${
        link.page
      }`;
      return (
        <li key={link.page} className={styles.navListItem}>
          <NavLink
            activeClassName={styles.navLinkActive}
            className={styles.navLink}
            to={pageHref}>
            {link.label}
          </NavLink>
        </li>
      );
    }
    if (link.href) {
      // set link to specified href
      return (
        <li key={link.label} className={styles.navListItem}>
          <a href={link.href} className={styles.navLink}>
            {link.label}
          </a>
        </li>
      );
    }
    if (link.blog) {
      // set link to blog url
      const blogUrl = `${baseUrl}blog`;
      return (
        <li key="Blog" className={styles.navListItem}>
          <NavLink
            activeClassName={styles.navLinkActive}
            className={styles.navLink}
            to={blogUrl}>
            Blog
          </NavLink>
        </li>
      );
    }
    return null;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <ul className={styles.navList}>
          <li key="logo" className={styles.navListItem}>
            <NavLink className={styles.navBrand} to="/">
              <img
                alt="Docusaurus Logo"
                className={styles.navLogo}
                src={baseUrl + headerIcon}
              />
              <strong>Docusaurus</strong>
            </NavLink>
          </li>
          {headerLinks.map(makeLinks)}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
