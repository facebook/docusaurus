/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/theme-search-algolia/client' {
  export function useAlgoliaContextualFacetFilters(): [string, string[]];
}

declare module '@theme/SearchPage' {
  const SearchPage: () => JSX.Element;
  export default SearchPage;
}

declare module '@theme/SearchMetadata' {
  export type SearchMetadataProps = {
    readonly locale?: string;
    readonly version?: string;
    readonly tag?: string;
  };

  const SearchMetadata: (props: SearchMetadataProps) => JSX.Element;
  export default SearchMetadata;
}

declare module '@theme/SearchBar' {
  const SearchBar: () => JSX.Element;
  export default SearchBar;
}
