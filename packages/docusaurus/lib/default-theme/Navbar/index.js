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
        <div key={link.doc} className="navbar__item">
          <Link
            activeClassName="navbar__link--active"
            className="navbar__link"
            to={docs[id].permalink}>
            {link.label}
          </Link>
        </div>
      );
    }
    if (link.page) {
      // set link to page with current page's language if appropriate
      const pageHref = `${baseUrl}${thisLanguage ? `${thisLanguage}/` : ''}${
        link.page
      }`;
      return (
        <div key={link.page} className="navbar__item">
          <Link
            activeClassName="navbar__link--active"
            className="navbar__link"
            to={pageHref}>
            {link.label}
          </Link>
        </div>
      );
    }
    if (link.href) {
      // set link to specified href
      return (
        <div key={link.label} className="navbar__item">
          <Link to={link.href} className="navbar__link">
            {link.label}
          </Link>
        </div>
      );
    }
    if (link.blog) {
      // set link to blog url
      const blogUrl = `${baseUrl}blog`;
      return (
        <div key="Blog" className="navbar__item">
          <Link
            activeClassName="navbar__link--active"
            className="navbar__link"
            to={blogUrl}>
            Blog
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <nav className="navbar navbar--light navbar--fixed-top">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link
            className="navbar__brand"
            to={baseUrl + (translationEnabled ? thisLanguage : '')}>
            {headerIcon && (
              <img
                className="navbar__logo"
                src={baseUrl + headerIcon}
                alt={title}
              />
            )}
            {!disableHeaderTitle && <strong>{title}</strong>}
          </Link>
          {versioningEnabled && (
            <div key="versions" className="navbar__item">
              <Link
                className="navbar__link"
                to={
                  baseUrl +
                  (translationEnabled ? `${thisLanguage}/versions` : `versions`)
                }>
                {thisVersion || defaultVersion}
              </Link>
            </div>
          )}
          {headerLinks.map(makeLinks)}
        </div>
        <div className="navbar__items navbar__items--right">
          {algolia && (
            <div className="navbar__search" key="search-box">
              <Search {...props} />
            </div>
          )}
          <div className="navbar__item">
            <a
              className="navbar__link"
              href="https://github.com/facebook/docusaurus"
              rel="noopener noreferrer"
              target="_blank">
              <i className="fab fa-github fa-lg" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
