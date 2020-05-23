/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useHistory, useLocation} from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const SEARCH_PARAM_QUERY = 'q';

function useSearchQuery() {
  const history = useHistory();
  const location = useLocation();

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
    navigateToSearchPage: (searchValue) => {
      history.push(`/search?q=${searchValue}`);
    },
  };
}

export default useSearchQuery;
