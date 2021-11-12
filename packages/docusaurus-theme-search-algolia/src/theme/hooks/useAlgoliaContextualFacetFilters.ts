/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useContextualSearchFilters from '@theme/hooks/useContextualSearchFilters';
import type {AlgoliaContextualFacetFilters} from '@theme/hooks/useAlgoliaContextualFacetFilters';

// Translate search-engine agnostic search filters to Algolia search filters
export default function useAlgoliaContextualFacetFilters(): AlgoliaContextualFacetFilters {
  const {locale, tags} = useContextualSearchFilters();

  // seems safe to convert locale->language, see AlgoliaSearchMetadata comment
  const languageFilter = `language:${locale}`;

  const tagsFilter = tags.map((tag) => `docusaurus_tag:${tag}`);

  return [languageFilter, tagsFilter];
}
