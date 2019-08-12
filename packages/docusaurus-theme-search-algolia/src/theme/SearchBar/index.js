/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
  useRef,
  useCallback,
} from 'react';
import DocusaurusContext from '@docusaurus/context';

import './styles.css';

const Search = props => {
  const [isEnabled, setIsEnabled] = useState(true);
  const searchBarRef = useRef(null);
  const context = useContext(DocusaurusContext);

  useEffect(() => {
    const {siteConfig = {}} = context;
    const {
      themeConfig: {algolia},
    } = siteConfig;

    // https://github.com/algolia/docsearch/issues/352
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      import('docsearch.js').then(({default: docsearch}) => {
        docsearch({
          appId: algolia.appId,
          apiKey: algolia.apiKey,
          indexName: algolia.indexName,
          inputSelector: '#search_input_react',
          algoliaOptions: algolia.algoliaOptions,
        });
      });
    } else {
      console.warn('Search has failed to load and now is being disabled');
      setIsEnabled(false);
    }
  }, []);

  const toggleSearchIconClick = useCallback(() => {
    props.handleSearchBarToggle(!props.isSearchBarExpanded);
  }, [props.isSearchBarExpanded]);

  useEffect(() => {
    if (props.isSearchBarExpanded) {
      searchBarRef.current.focus();
    }
  }, [props.isSearchBarExpanded]);

  return isEnabled ? (
    <Fragment>
      <span
        role="button"
        className={`search-icon ${
          props.isSearchBarExpanded ? 'search-icon-hidden' : ''
        }`}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={`${
          props.isSearchBarExpanded ? 'search-bar-expanded' : 'search-bar'
        }`}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />
    </Fragment>
  ) : null;
};

export default Search;
