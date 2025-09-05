/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useCallback, useMemo, useState} from 'react';
import {
  version as docsearchVersion,
  type DocSearchModalProps,
  type DocSearchTranslations,
} from '@docsearch/react';
import translations from '@theme/SearchTranslations';
import type {ThemeConfigAlgolia} from '@docusaurus/theme-search-algolia';

type AskAiConfig = NonNullable<ThemeConfigAlgolia['askAi']>;

// The minimal props the hook needs from DocSearch v4 props
interface DocSearchV4PropsLite {
  indexName: string;
  apiKey: string;
  appId: string;
  placeholder?: string;
  translations?: DocSearchTranslations;
  searchParameters?: DocSearchModalProps['searchParameters'];
  askAi?: AskAiConfig;
}

const isV4 = docsearchVersion.startsWith('4.');

type UseAskAiResult = {
  canHandleAskAi: boolean;
  isAskAiActive: boolean;
  currentPlaceholder: string | undefined;
  onAskAiToggle: (active: boolean) => void;
  askAi?: AskAiConfig;
  extraAskAiProps: Partial<DocSearchModalProps> & {
    askAi?: AskAiConfig;
    canHandleAskAi?: boolean;
    isAskAiActive?: boolean;
    onAskAiToggle?: (active: boolean) => void;
  };
};

export function useAlgoliaAskAi(
  props: DocSearchV4PropsLite,
  searchParameters: DocSearchModalProps['searchParameters'],
): UseAskAiResult {
  const [isAskAiActive, setIsAskAiActive] = useState(false);

  const askAiProp = props.askAi as DocSearchV4PropsLite['askAi'];

  const canHandleAskAi = Boolean(props?.askAi);

  let currentPlaceholder =
    ((
      translations.modal as unknown as {
        searchBox?: {placeholderText?: string};
      }
    )?.searchBox?.placeholderText as string | undefined) || props?.placeholder;

  if (isAskAiActive && isV4) {
    currentPlaceholder = (
      translations.modal as unknown as {
        searchBox?: {placeholderTextAskAi?: string};
      }
    )?.searchBox?.placeholderTextAskAi as string;
  }

  const onAskAiToggle = useCallback((askAiToggle: boolean) => {
    setIsAskAiActive(askAiToggle);
  }, []);

  // TODO handle this in Joy schema?
  const askAi: AskAiConfig | undefined = useMemo(() => {
    if (!askAiProp) {
      return undefined;
    }

    return {
      indexName: askAiProp.indexName,
      apiKey: askAiProp.apiKey,
      appId: askAiProp.appId,
      assistantId: askAiProp.assistantId,
      searchParameters: searchParameters?.facetFilters
        ? {facetFilters: searchParameters.facetFilters}
        : undefined,
    };
  }, [askAiProp, searchParameters]);

  const extraAskAiProps: UseAskAiResult['extraAskAiProps'] = {
    askAi,
    canHandleAskAi,
    isAskAiActive,
    onAskAiToggle,
  };

  return {
    canHandleAskAi,
    isAskAiActive,
    currentPlaceholder,
    onAskAiToggle,
    askAi,
    extraAskAiProps,
  };
}
