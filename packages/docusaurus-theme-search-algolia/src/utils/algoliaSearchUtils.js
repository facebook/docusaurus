/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useContextualSearchFilters from '@theme/hooks/useContextualSearchFilters';

// Translate search-engine agnostic seach filters to Algolia search filters
export function useAlgoliaContextualSearchParameters() {
  const {language, tags} = useContextualSearchFilters();

  const languageFilter = `language:${language}`;

  const tagsFilter = tags.map((tag) => `docusaurus_tag:${tag}`);

  return {facetFilters: [languageFilter, tagsFilter]};
}
