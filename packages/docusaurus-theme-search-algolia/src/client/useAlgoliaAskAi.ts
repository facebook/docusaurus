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

// We need to apply contextualSearch facetFilters to AskAI as well
// This can't be done at config normalization time
function applyAskAiSearchParameters(
  askAi: AskAiConfig | undefined,
  _searchParameters: DocSearchModalProps['searchParameters'],
): AskAiConfig | undefined {
  if (!askAi) {
    return undefined;
  }

  // TODO implement the logic here!

  return askAi;
}

export function useAlgoliaAskAi(
  props: DocSearchV4PropsLite,
  searchParameters: DocSearchModalProps['searchParameters'],
): UseAskAiResult {
  const [isAskAiActive, setIsAskAiActive] = useState(false);

  const askAi = useMemo(() => {
    return applyAskAiSearchParameters(props.askAi, searchParameters);
  }, [props.askAi, searchParameters]);

  const canHandleAskAi = Boolean(askAi);

  const currentPlaceholder =
    isAskAiActive && isV4
      ? translations.modal?.searchBox?.placeholderTextAskAi
      : translations.modal?.searchBox?.placeholderText || props?.placeholder;

  const onAskAiToggle = useCallback((askAiToggle: boolean) => {
    setIsAskAiActive(askAiToggle);
  }, []);

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
