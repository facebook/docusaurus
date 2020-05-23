/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useRef, useCallback} from 'react';
import classnames from 'classnames';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';
import useSearchQuery from '@theme/hooks/useSearchQuery';

import styles from './styles.module.css';

const Search = ({handleSearchBarToggle, isSearchBarExpanded}) => {
  const [algoliaLoaded, setAlgoliaLoaded] = useState(false);
  const searchBarRef = useRef(null);
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    themeConfig: {algolia},
  } = siteConfig;
  const history = useHistory();
  const {navigateToSearchPage} = useSearchQuery();

  function initAlgolia(focus) {
    window.docsearch({
      appId: algolia.appId,
      apiKey: algolia.apiKey,
      indexName: algolia.indexName,
      inputSelector: '#search_input_react',
      algoliaOptions: algolia.algoliaOptions,
      autocompleteOptions: {
        openOnFocus: true,
        autoselect: false,
        hint: false,
      },
      // Override algolia's default selection event, allowing us to do client-side
      // navigation and avoiding a full page refresh.
      handleSelected: (_input, _event, suggestion) => {
        _event.stopPropagation();

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

  const toggleSearchInput = useCallback(() => {
    loadAlgolia();

    if (algoliaLoaded) {
      searchBarRef.current.focus();
    }

    handleSearchBarToggle(!isSearchBarExpanded);
  }, [isSearchBarExpanded]);

  const handleSearchInputBlur = useCallback(() => {
    handleSearchBarToggle(!isSearchBarExpanded);
  }, [isSearchBarExpanded]);

  const handleSearchInput = useCallback((e) => {
    const needFocus = e.type !== 'mouseover';

    loadAlgolia(needFocus);
  });

  const handleSearchInputPressEnter = useCallback((e) => {
    if (!e.defaultPrevented && e.key === 'Enter') {
      navigateToSearchPage(e.target.value);
    }
  });

  return (
    <div className="navbar__search" key="search-box">
      <div className={styles.searchWrapper}>
        <span
          aria-label="expand searchbar"
          role="button"
          className={classnames(styles.searchIconButton, {
            [styles.searchIconButtonHidden]: isSearchBarExpanded,
          })}
          onClick={toggleSearchInput}
          onKeyDown={toggleSearchInput}
          tabIndex={0}
        />

        <input
          id="search_input_react"
          type="search"
          placeholder="Search"
          aria-label="Search"
          className={classnames('navbar__search-input', styles.searchInput, {
            [styles.searchInputExpanded]: isSearchBarExpanded,
          })}
          onMouseOver={handleSearchInput}
          onFocus={handleSearchInput}
          onBlur={handleSearchInputBlur}
          onKeyDown={handleSearchInputPressEnter}
          ref={searchBarRef}
        />
      </div>
    </div>
  );
};

export default Search;
