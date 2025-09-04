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
import type {FacetFilters} from 'algoliasearch/lite';

// v4 specific types
type AskAiConfig = {
  indexName: string;
  apiKey: string;
  appId: string;
  assistantId: string;
  searchParameters?: {
    facetFilters: FacetFilters;
  };
};

// minimal props the hook needs from docsearch v4 props
interface DocSearchV4PropsLite {
  indexName: string;
  apiKey: string;
  appId: string;
  placeholder?: string;
  translations?: DocSearchTranslations;
  searchParameters?: DocSearchModalProps['searchParameters'];
  askAi?: string | AskAiConfig;
}

const isV4 = docsearchVersion.startsWith('4.');

export function useAlgoliaAskAi(
  props: DocSearchV4PropsLite,
  searchParameters: DocSearchModalProps['searchParameters'],
): {
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
} {
  const [isAskAiActive, setIsAskAiActive] = useState(false);

  const askAiProp = props.askAi as DocSearchV4PropsLite['askAi'];

  // validate AskAI compatibility with docsearch version
  if (askAiProp && !isV4) {
    throw new Error(
      'The askAi feature is only supported in DocSearch v4. ' +
        'Please upgrade to DocSearch v4 by installing "@docsearch/react": "^4.0.0" ' +
        'or remove the askAi configuration from your theme config.',
    );
  }

  const canHandleAskAi = Boolean(props?.askAi);

  let currentPlaceholder =
    ((translations.modal as unknown as {searchBox?: {placeholderText?: string}})
      ?.searchBox?.placeholderText as string | undefined) || props?.placeholder;

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

  const isAskAiPropAssistantId = typeof askAiProp === 'string';

  const askAi = useMemo(() => {
    if (!askAiProp) {
      return undefined;
    }

    return {
      indexName: isAskAiPropAssistantId ? props.indexName : askAiProp.indexName,
      apiKey: isAskAiPropAssistantId ? props.apiKey : askAiProp.apiKey,
      appId: isAskAiPropAssistantId ? props.appId : askAiProp.appId,
      assistantId: isAskAiPropAssistantId ? askAiProp : askAiProp.assistantId,
      searchParameters: searchParameters?.facetFilters
        ? {facetFilters: searchParameters.facetFilters}
        : undefined,
    } as AskAiConfig;
  }, [
    askAiProp,
    isAskAiPropAssistantId,
    props.indexName,
    props.apiKey,
    props.appId,
    searchParameters,
  ]);

  const extraAskAiProps: Partial<DocSearchModalProps> & {
    askAi?: AskAiConfig;
    canHandleAskAi?: boolean;
    isAskAiActive?: boolean;
    onAskAiToggle?: (active: boolean) => void;
  } = {
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
  } as const;
}
