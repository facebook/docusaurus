/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/theme-search-algolia' {
  import type {DeepPartial} from 'utility-types';

  export type ThemeConfig = {
    algolia: {
      contextualSearch: boolean;
      externalUrlRegex?: string;
      appId: string;
      apiKey: string;
      indexName: string;
      searchParameters: Record<string, unknown>;
    };
  };
  export type UserThemeConfig = DeepPartial<ThemeConfig>;
}

declare module '@docusaurus/theme-search-algolia/client' {
  export function useAlgoliaContextualFacetFilters(): [string, string[]];
}

declare module '@theme/SearchPage' {
  const SearchPage: () => JSX.Element;
  export default SearchPage;
}

declare module '@theme/SearchBar' {
  const SearchBar: () => JSX.Element;
  export default SearchBar;
}
