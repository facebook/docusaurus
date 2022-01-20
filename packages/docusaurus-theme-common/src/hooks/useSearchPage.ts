/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useCallback, useEffect, useState} from 'react';

const SEARCH_PARAM_QUERY = 'q';

interface UseSearchPageReturn {
  searchQuery: string;
  setSearchQuery: (newSearchQuery: string) => void;
  generateSearchPageLink: (targetSearchQuery: string) => string;
}

export default function useSearchPage(): UseSearchPageReturn {
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
      `${baseUrl}search?q=${encodeURIComponent(targetSearchQuery)}`,
    [baseUrl],
  );

  return {
    searchQuery,
    setSearchQuery,
    generateSearchPageLink,
  };
}
