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
  const [isExpanded, setIsExpanded] = useState(false);
  const [enabled, setEnabled] = useState(true);
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
      setEnabled(false);
    }
  }, []);

  const toggleSearchIconClick = useCallback(() => {
    setIsExpanded(oldState => !oldState);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      searchBarRef.current.focus();
    }
    props.handleSearchBarToggle(isExpanded);
  }, [isExpanded]);

  return enabled ? (
    <Fragment>
      <span
        role="button"
        className={`search-icon ${isExpanded ? 'search-icon-hidden' : ''}`}
        onClick={toggleSearchIconClick}
        onKeyDown={toggleSearchIconClick}
        tabIndex={0}
      />
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
        className={`${isExpanded ? 'search-bar-expanded' : 'search-bar'}`}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />
    </Fragment>
  ) : null;
};

export default Search;
