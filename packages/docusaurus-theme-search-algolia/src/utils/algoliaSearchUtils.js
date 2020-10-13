/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useSearchFilters from '@theme/hooks/useSearchFilters';

// Translate search-engine agnostic seach filters to Algolia search filters
export function useAlgoliaSearchParameters() {
  const {language, tags} = useSearchFilters();

  const languageFilter = `language:${language}`;

  const tagsFilter = tags.map((tag) => `docusaurus_tag:${tag}`);

  return {facetFilters: [languageFilter, tagsFilter]};
}
