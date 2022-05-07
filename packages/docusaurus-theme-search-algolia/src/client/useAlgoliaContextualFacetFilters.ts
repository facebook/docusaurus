/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContextualSearchFilters} from '@docusaurus/theme-common';

// Translate search-engine agnostic search filters to Algolia search filters
export function useAlgoliaContextualFacetFilters(): [string, string[]] {
  const {locale, tags} = useContextualSearchFilters();

  // Seems safe to convert locale->language, see AlgoliaSearchMetadata comment
  const languageFilter = `language:${locale}`;

  const tagsFilter = tags.map((tag) => `docusaurus_tag:${tag}`);

  return [languageFilter, tagsFilter];
}
