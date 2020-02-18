/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useRef, useCallback} from 'react';
import classnames from 'classnames';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';

import './styles.css';

const Search = props => {
  const [algoliaLoaded, setAlgoliaLoaded] = useState(false);
  const searchBarRef = useRef(null);
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    themeConfig: {algolia},
  } = siteConfig;
  const history = useHistory();

  function initAlgolia(focus) {
    window.docsearch({
      appId: algolia.appId,
      apiKey: algolia.apiKey,
      indexName: algolia.indexName,
      inputSelector: '#search_input_react',
      algoliaOptions: algolia.algoliaOptions,
      // Override algolia's default selection event, allowing us to do client-side
      // navigation and avoiding a full page refresh.
      handleSelected: (_input, _event, suggestion) => {
        // Use an anchor tag to parse the absolute url into a relative url
        // Alternatively, we can use new URL(suggestion.url) but it's not supported in IE.
        const a = document.createElement('a');
        a.href = suggestion.url;

        // Algolia use closest parent element id #__docusaurus when a h1 page title does
        // not have an id, so we can safely remove it.
        // See https://github.com/facebook/docusaurus/issues/1828 for more details.
        const routePath =
          `#__docusaurus` === a.hash
            ? `${a.pathname}`
            : `${a.pathname}${a.hash}`;
        history.push(routePath);
      },
    });

    if (focus) {
      searchBarRef.current.focus();
    }
  }

  const loadAlgolia = (focus = true) => {
    if (algoliaLoaded) {
      return;
    }

    Promise.all([import('docsearch.js'), import('./algolia.css')]).then(
      ([{default: docsearch}]) => {
        setAlgoliaLoaded(true);
        window.docsearch = docsearch;
        initAlgolia(focus);
      },
    );
  };

  const handleSearchIcon = useCallback(() => {
    loadAlgolia();

    if (algoliaLoaded) {
      searchBarRef.current.focus();
    }

    props.handleSearchBarToggle(!props.isSearchBarExpanded);
  }, [props.isSearchBarExpanded]);

  const handleSearchInputBlur = useCallback(() => {
    props.handleSearchBarToggle(!props.isSearchBarExpanded);
  }, [props.isSearchBarExpanded]);

  const handleSearchInput = useCallback(e => {
    const needFocus = e.type !== 'mouseover';

    loadAlgolia(needFocus);
  });

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={classnames('search-icon', {
          'search-icon-hidden': props.isSearchBarExpanded,
        })}
        onClick={handleSearchIcon}
        onKeyDown={handleSearchIcon}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={classnames(
          'navbar__search-input',
          {'search-bar-expanded': props.isSearchBarExpanded},
          {'search-bar': !props.isSearchBarExpanded},
        )}
        onMouseOver={handleSearchInput}
        onFocus={handleSearchInput}
        onBlur={handleSearchInputBlur}
        ref={searchBarRef}
      />
    </div>
  );
};

export default Search;
