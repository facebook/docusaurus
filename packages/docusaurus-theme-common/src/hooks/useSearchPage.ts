/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useQueryString} from '../utils/historyUtils';
import type {ThemeConfig as AlgoliaThemeConfig} from '@docusaurus/theme-search-algolia';

const SEARCH_PARAM_QUERY = 'q';

/**
 * Permits to read/write the current search query string
 */
export function useSearchQueryString(): [string, (newValue: string) => void] {
  return useQueryString(SEARCH_PARAM_QUERY);
}

/**
 * Permits to create links to the search page with the appropriate query string
 */
export function useSearchLinkCreator(): (searchValue: string) => string {
  const {
    siteConfig: {baseUrl, themeConfig},
  } = useDocusaurusContext();
  const {
    algolia: {searchPagePath},
  } = themeConfig as AlgoliaThemeConfig;

  return useCallback(
    (searchValue: string) =>
      // Refer to https://github.com/facebook/docusaurus/pull/2838
      // Note: if searchPagePath is falsy, useSearchPage() will not be called
      `${baseUrl}${
        searchPagePath as string
      }?${SEARCH_PARAM_QUERY}=${encodeURIComponent(searchValue)}`,
    [baseUrl, searchPagePath],
  );
}
