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
      searchParameters: {[key: string]: unknown};
      searchPagePath: string | false | null;
    };
  };
  export type UserThemeConfig = DeepPartial<ThemeConfig>;
}

declare module '@docusaurus/theme-search-algolia/client' {
  export function useAlgoliaContextualFacetFilters(): [string, string[]];
}

declare module '@theme/SearchPage' {
  export default function SearchPage(): JSX.Element;
}

declare module '@theme/SearchBar' {
  export default function SearchBar(): JSX.Element;
}

declare module '@theme/SearchTranslations' {
  import type {DocSearchTranslations} from '@docsearch/react';

  const translations: DocSearchTranslations & {placeholder: string};
  export default translations;
}
