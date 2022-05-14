/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useEffect, useState} from 'react';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const SEARCH_PARAM_QUERY = 'q';

/** Some utility functions around search queries. */
export function useSearchPage(): {
  /**
   * Works hand-in-hand with `setSearchQuery`; whatever the user has inputted
   * into the search box.
   */
  searchQuery: string;
  /**
   * Set a new search query. In addition to updating `searchQuery`, this handle
   * also mutates the location and appends the query.
   */
  setSearchQuery: (newSearchQuery: string) => void;
  /**
   * Given a query, this handle generates the corresponding search page link,
   * with base URL prepended.
   */
  generateSearchPageLink: (targetSearchQuery: string) => string;
} {
  const history = useHistory();
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();

  const [searchQuery, setSearchQueryState] = useState('');

  // Init search query just after React hydration
  useEffect(() => {
    const searchQueryStringValue =
      new URLSearchParams(window.location.search).get(SEARCH_PARAM_QUERY) ?? '';

    setSearchQueryState(searchQueryStringValue);
  }, []);

  const setSearchQuery = useCallback(
    (newSearchQuery: string) => {
      const searchParams = new URLSearchParams(window.location.search);

      if (newSearchQuery) {
        searchParams.set(SEARCH_PARAM_QUERY, newSearchQuery);
      } else {
        searchParams.delete(SEARCH_PARAM_QUERY);
      }

      history.replace({
        search: searchParams.toString(),
      });
      setSearchQueryState(newSearchQuery);
    },
    [history],
  );

  const generateSearchPageLink = useCallback(
    (targetSearchQuery: string) =>
      // Refer to https://github.com/facebook/docusaurus/pull/2838
      `${baseUrl}search?${SEARCH_PARAM_QUERY}=${encodeURIComponent(
        targetSearchQuery,
      )}`,
    [baseUrl],
  );

  return {
    searchQuery,
    setSearchQuery,
    generateSearchPageLink,
  };
}
