/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';

import Link from '@docusaurus/Link';
import Search from '@theme/Search';
import DocusaurusContext from '@docusaurus/context';
import styles from './styles.module.css';

function Navbar(props) {
  const context = useContext(DocusaurusContext);
  const {siteConfig = {}, env = {}, metadata = {}, docsMetadata} = context;
  const {
    baseUrl,
    headerLinks,
    headerIcon,
    algolia,
    title,
    disableHeaderTitle,
  } = siteConfig;

  const {language: thisLanguage, version: thisVersion} = metadata;

  const translationEnabled = env.translation.enabled;
  const versioningEnabled = env.versioning.enabled;
  const defaultVersion = versioningEnabled && env.versioning.defaultVersion;

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
      const {docs} = docsMetadata;
      if (!docs[id]) {
        const errorStr = `We could not find the doc with id: ${id}. Please check your headerLinks correctly\n`;
        throw new Error(errorStr);
      }
      return (
        <li key={link.doc} className={styles.navListItem}>
          <Link
            activeClassName={styles.navLinkActive}
            className={styles.navLink}
            to={docs[id].permalink}>
            {link.label}
          </Link>
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
          <Link
            activeClassName={styles.navLinkActive}
            className={styles.navLink}
            to={pageHref}>
            {link.label}
          </Link>
        </li>
      );
    }
    if (link.href) {
      // set link to specified href
      return (
        <li key={link.label} className={styles.navListItem}>
          <Link to={link.href} className={styles.navLink}>
            {link.label}
          </Link>
        </li>
      );
    }
    if (link.blog) {
      // set link to blog url
      const blogUrl = `${baseUrl}blog`;
      return (
        <li key="Blog" className={styles.navListItem}>
          <Link
            activeClassName={styles.navLinkActive}
            className={styles.navLink}
            to={blogUrl}>
            Blog
          </Link>
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
            <Link
              className={styles.navBrand}
              to={baseUrl + (translationEnabled ? thisLanguage : '')}>
              {headerIcon && (
                <img
                  className={styles.navLogo}
                  src={baseUrl + headerIcon}
                  alt={title}
                />
              )}
              {!disableHeaderTitle && <strong>{title}</strong>}
            </Link>
          </li>
          {versioningEnabled && (
            <li key="versions" className={styles.navListItem}>
              <Link
                className={styles.navVersion}
                to={
                  baseUrl +
                  (translationEnabled ? `${thisLanguage}/versions` : `versions`)
                }>
                {thisVersion || defaultVersion}
              </Link>
            </li>
          )}
          {headerLinks.map(makeLinks)}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
