/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useHistory, useLocation} from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const SEARCH_PARAM_QUERY = 'q';

function useSearchQuery() {
  const history = useHistory();
  const location = useLocation();
  const {siteConfig: {baseUrl} = {}} = useDocusaurusContext();

  return {
    searchValue:
      (ExecutionEnvironment.canUseDOM &&
        new URLSearchParams(location.search).get(SEARCH_PARAM_QUERY)) ||
      '',
    updateSearchPath: (searchValue) => {
      const searchParams = new URLSearchParams(location.search);

      if (searchValue) {
        searchParams.set(SEARCH_PARAM_QUERY, searchValue);
      } else {
        searchParams.delete(SEARCH_PARAM_QUERY);
      }

      history.replace({
        search: searchParams.toString(),
      });
    },
    generateSearchPageLink: (searchValue) => {
      // Refer to https://github.com/facebook/docusaurus/pull/2838
      return `${baseUrl}search?q=${searchValue}`;
    },
  };
}

export default useSearchQuery;
