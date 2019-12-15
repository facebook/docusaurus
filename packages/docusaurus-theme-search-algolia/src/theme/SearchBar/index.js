/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useRef, useCallback} from 'react';
import classnames from 'classnames';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';

let loaded = false;

const Search = props => {
  const initialized = useRef(false);
  const searchBarRef = useRef(null);
  const {siteConfig = {}} = useDocusaurusContext();
  const {
    themeConfig: {algolia},
  } = siteConfig;
  const history = useHistory();

  const initAlgolia = () => {
    if (!initialized.current) {
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
          // Alternatively, we can use new URL(suggestion.url) but its not supported in IE
          const a = document.createElement('a');
          a.href = suggestion.url;

          // Algolia use closest parent element id #__docusaurus when a h1 page title does not have an id
          // So, we can safely remove it. See https://github.com/facebook/docusaurus/issues/1828 for more details.
          const routePath =
            `#__docusaurus` === a.hash
              ? `${a.pathname}`
              : `${a.pathname}${a.hash}`;
          history.push(routePath);
        },
      });
      initialized.current = true;
    }
  };

  const loadAlgolia = () => {
    if (!loaded) {
      Promise.all([import('docsearch.js'), import('./algolia.css')]).then(
        ([{default: docsearch}]) => {
          loaded = true;
          window.docsearch = docsearch;
          initAlgolia();
        },
      );
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
        onClick={loadAlgolia}
        onMouseOver={loadAlgolia}
        onFocus={toggleSearchIconClick}
        onBlur={toggleSearchIconClick}
        ref={searchBarRef}
      />
    </div>
  );
};

export default Search;
