/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {useAlgoliaContextualFacetFiltersReturns} from '@theme/hooks/useAlgoliaContextualFacetFilters';
import {useContextualSearchFilters} from '@docusaurus/theme-common';

// Translate search-engine agnostic search filters to Algolia search filters
export default function useAlgoliaContextualFacetFilters(): useAlgoliaContextualFacetFiltersReturns {
  const {locale, tags} = useContextualSearchFilters();

  // seems safe to convert locale->language, see AlgoliaSearchMetadata comment
  const languageFilter = `language:${locale}`;

  const tagsFilter = tags.map((tag) => `docusaurus_tag:${tag}`);

  return [languageFilter, tagsFilter];
}
