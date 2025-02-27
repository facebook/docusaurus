/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/theme-search-algolia' {
  import type {DeepPartial} from 'utility-types';
  import type {DocSearchProps} from '@docsearch/react';

  // DocSearch props that Docusaurus exposes directly through props forwarding
  type DocusaurusDocSearchProps = Pick<
    DocSearchProps,
    | 'appId'
    | 'apiKey'
    | 'indexName'
    | 'placeholder'
    | 'translations'
    | 'searchParameters'
    | 'insights'
    | 'initialQuery'
  >;

  type ThemeConfigAlgolia = DocusaurusDocSearchProps & {
    // Docusaurus custom options, not coming from DocSearch
    contextualSearch: boolean;
    externalUrlRegex?: string;
    searchPagePath: string | false | null;
    replaceSearchResultPathname?: {
      from: string;
      to: string;
    };
  };

  export type ThemeConfig = DocusaurusDocSearchProps & {
    algolia: ThemeConfigAlgolia;
  };

  export type UserThemeConfig = DeepPartial<ThemeConfig>;
}

declare module '@docusaurus/theme-search-algolia/client' {
  import type {ThemeConfig} from '@docusaurus/theme-search-algolia';

  export function useAlgoliaThemeConfig(): ThemeConfig;

  export function useAlgoliaContextualFacetFilters(): [string, string[]];

  export function useSearchResultUrlProcessor(): (url: string) => string;
}

declare module '@theme/SearchPage' {
  import type {ReactNode} from 'react';

  export default function SearchPage(): ReactNode;
}

declare module '@theme/SearchBar' {
  import type {ReactNode} from 'react';

  export default function SearchBar(): ReactNode;
}

declare module '@theme/SearchTranslations' {
  import type {DocSearchTranslations} from '@docsearch/react';

  const translations: DocSearchTranslations & {placeholder: string};
  export default translations;
}
