/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useRef, useCallback} from 'react';
import classnames from 'classnames';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import './styles.css';

const loadJS = () => import('docsearch.js');
let loadedJs = false;

const Search = props => {
  const [initialized, setInitialized] = useState(false);
  const searchBarRef = useRef(null);
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    themeConfig: {algolia},
  } = siteConfig;

  const initAlgolia = () => {
    if (!initialized) {
      window.docsearch({
        appId: algolia.appId,
        apiKey: algolia.apiKey,
        indexName: algolia.indexName,
        inputSelector: '#search_input_react',
        algoliaOptions: algolia.algoliaOptions,
      });
      setInitialized(true);
    }
  };

  const loadAlgoliaJS = () => {
    if (!loadedJs) {
      loadJS().then(a => {
        loadedJs = true;
        window.docsearch = a.default;
        initAlgolia();
      });
    } else {
      initAlgolia();
    }
  };

  const toggleSearchIconClick = useCallback(
    e => {
      if (!searchBarRef.current.contains(e.target)) {
        searchBarRef.current.focus();
      }

      props.handleSearchBarToggle(!props.isSearchBarExpanded);
    },
    [props.isSearchBarExpanded],
  );

  return (
    <div className="navbar__search" key="search-box">
      <span
        aria-label="expand searchbar"
        role="button"
        className={classnames('search-icon', {
          'search-icon-hidden': props.isSearchBarExpanded,
        })}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
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
        onClick={loadAlgoliaJS}
        onMouseOver={loadAlgoliaJS}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />
    </div>
  );
};

export default Search;
