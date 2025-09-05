/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/theme-search-algolia' {
  import type {DeepPartial, Overwrite} from 'utility-types';

  import type {DocSearchProps} from '@docsearch/react';
  import type {FacetFilters} from 'algoliasearch/lite';

  // The config after normalization (e.g. AskAI string -> object)
  type AskAiConfig = {
    indexName: string;
    apiKey: string;
    appId: string;
    assistantId: string;
    searchParameters?: {
      facetFilters: FacetFilters;
    };
  };

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
  > & {
    // Docusaurus normalizes the AskAI config to an object
    askAi?: AskAiConfig;
  };

  export type ThemeConfigAlgolia = DocusaurusDocSearchProps & {
    // Docusaurus custom options, not coming from DocSearch
    contextualSearch: boolean;
    externalUrlRegex?: string;
    searchPagePath: string | false | null;
    replaceSearchResultPathname?: {
      from: string;
      to: string;
    };
  };

  export type ThemeConfig = {
    algolia: ThemeConfigAlgolia;
  };

  export type UserThemeConfig = {
    algolia?: Overwrite<
      DeepPartial<ThemeConfigAlgolia>,
      {
        askAi?: string | AskAiConfig;
      }
    >;
  };
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
