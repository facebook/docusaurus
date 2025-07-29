/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {createPortal} from 'react-dom';
import {
  DocSearchButton,
  useDocSearchKeyboardEvents,
  version as docsearchVersion,
} from '@docsearch/react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import {
  isRegexpStringMatch,
  useSearchLinkCreator,
} from '@docusaurus/theme-common';
import {
  useAlgoliaContextualFacetFilters,
  useSearchResultUrlProcessor,
} from '@docusaurus/theme-search-algolia/client';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import translations from '@theme/SearchTranslations';
import type {
  InternalDocSearchHit,
  DocSearchModal as DocSearchModalType,
  DocSearchModalProps,
  StoredDocSearchHit,
  DocSearchTransformClient,
  DocSearchHit,
  DocSearchTranslations,
} from '@docsearch/react';

import type {AutocompleteState} from '@algolia/autocomplete-core';
import type {FacetFilters} from 'algoliasearch/lite';

type DocSearchProps = Omit<
  DocSearchModalProps,
  'onClose' | 'initialScrollY'
> & {
  contextualSearch?: string;
  externalUrlRegex?: string;
  searchPagePath: boolean | string;
};

// V4 specific types
type AskAiConfig = {
  indexName: string;
  apiKey: string;
  appId: string;
  assistantId: string;
  searchParameters?: {
    facetFilters: FacetFilters;
  };
};

// Extend DocSearchProps for v4 features
interface DocSearchV4Props extends DocSearchProps {
  askAi?: string | AskAiConfig;
  translations?: DocSearchTranslations;
}

// Extend DocSearchModalProps for v4 features
interface DocSearchModalV4Props extends DocSearchModalProps {
  askAi?: AskAiConfig;
  canHandleAskAi?: boolean;
  isAskAiActive?: boolean;
  onAskAiToggle?: (active: boolean) => void;
}

const isV4 = docsearchVersion.startsWith('4');

let DocSearchModal: typeof DocSearchModalType | null = null;

function importDocSearchModalIfNeeded() {
  if (DocSearchModal) {
    return Promise.resolve();
  }
  return Promise.all([
    import('@docsearch/react/modal') as Promise<
      typeof import('@docsearch/react')
    >,
    import('@docsearch/react/style'),
    import('./styles.css'),
  ]).then(([{DocSearchModal: Modal}]) => {
    DocSearchModal = Modal;
  });
}

function useNavigator({
  externalUrlRegex,
}: Pick<DocSearchProps, 'externalUrlRegex'>) {
  const history = useHistory();
  const [navigator] = useState<DocSearchModalProps['navigator']>(() => {
    return {
      navigate(params) {
        // Algolia results could contain URL's from other domains which cannot
        // be served through history and should navigate with window.location
        if (isRegexpStringMatch(externalUrlRegex, params.itemUrl)) {
          window.location.href = params.itemUrl;
        } else {
          history.push(params.itemUrl);
        }
      },
    };
  });
  return navigator;
}

function useTransformSearchClient(): DocSearchModalProps['transformSearchClient'] {
  const {
    siteMetadata: {docusaurusVersion},
  } = useDocusaurusContext();
  return useCallback(
    (searchClient: DocSearchTransformClient) => {
      searchClient.addAlgoliaAgent('docusaurus', docusaurusVersion);
      return searchClient;
    },
    [docusaurusVersion],
  );
}

function useTransformItems(props: Pick<DocSearchProps, 'transformItems'>) {
  const processSearchResultUrl = useSearchResultUrlProcessor();
  const [transformItems] = useState<DocSearchModalProps['transformItems']>(
    () => {
      return (items: DocSearchHit[]) =>
        props.transformItems
          ? // Custom transformItems
            props.transformItems(items)
          : // Default transformItems
            items.map((item) => ({
              ...item,
              url: processSearchResultUrl(item.url),
            }));
    },
  );
  return transformItems;
}

function useResultsFooterComponent({
  closeModal,
}: {
  closeModal: () => void;
}): DocSearchProps['resultsFooterComponent'] {
  return useMemo(
    () =>
      ({state}) =>
        <ResultsFooter state={state} onClose={closeModal} />,
    [closeModal],
  );
}

function useAskAi(
  props: DocSearchV4Props,
  searchParameters: DocSearchProps['searchParameters'],
) {
  const [isAskAiActive, setIsAskAiActive] = useState(false);

  const canHandleAskAi = Boolean(props?.askAi);

  let currentPlaceholder =
    (translations.modal?.searchBox as any)?.placeholderText ||
    props?.placeholder;

  if (isAskAiActive && isV4) {
    currentPlaceholder = (translations.modal?.searchBox as any)
      ?.placeholderTextAskAi as string;
  }

  const onAskAiToggle = useCallback((askAiToggle: boolean) => {
    setIsAskAiActive(askAiToggle);
  }, []);

  const askAiProp = props.askAi as
    | undefined
    | string
    | {
        indexName: string;
        apiKey: string;
        appId: string;
        assistantId: string;
      };

  const isAskAiPropAssistantId = typeof askAiProp === 'string';

  const askAi = useMemo(() => {
    if (!askAiProp) {
      return undefined;
    }

    if (askAiProp && !isV4) {
      console.warn(
        'Ask AI is ONLY supported in DocSearch v4. Please use to the latest version of DocSearch.',
      );
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
    };
  }, [
    askAiProp,
    isAskAiPropAssistantId,
    props.indexName,
    props.apiKey,
    props.appId,
    searchParameters,
  ]);

  // Utility to reset Ask AI active state when closing the modal -------------
  const resetAskAiActive = useCallback(() => {
    setIsAskAiActive(false);
  }, []);

  return {
    canHandleAskAi,
    isAskAiActive,
    currentPlaceholder,
    onAskAiToggle,
    askAi,
    resetAskAiActive,
  } as const;
}

function Hit({
  hit,
  children,
}: {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: ReactNode;
}) {
  return <Link to={hit.url}>{children}</Link>;
}

type ResultsFooterProps = {
  state: AutocompleteState<InternalDocSearchHit>;
  onClose: () => void;
};

function ResultsFooter({state, onClose}: ResultsFooterProps) {
  const createSearchLink = useSearchLinkCreator();

  return (
    <Link to={createSearchLink(state.query)} onClick={onClose}>
      <Translate
        id="theme.SearchBar.seeAll"
        values={{count: state.context.nbHits}}>
        {'See all {count} results'}
      </Translate>
    </Link>
  );
}

function useSearchParameters({
  contextualSearch,
  ...props
}: DocSearchProps): DocSearchProps['searchParameters'] {
  function mergeFacetFilters(f1: FacetFilters, f2: FacetFilters): FacetFilters {
    const normalize = (f: FacetFilters): FacetFilters =>
      typeof f === 'string' ? [f] : f;
    return [...normalize(f1), ...normalize(f2)];
  }

  const contextualSearchFacetFilters =
    useAlgoliaContextualFacetFilters() as FacetFilters;

  const configFacetFilters: FacetFilters =
    props.searchParameters?.facetFilters ?? [];

  const facetFilters: FacetFilters = contextualSearch
    ? // Merge contextual search filters with config filters
      mergeFacetFilters(contextualSearchFacetFilters, configFacetFilters)
    : // ... or use config facetFilters
      configFacetFilters;

  // We let users override default searchParameters if they want to
  return {
    ...props.searchParameters,
    facetFilters,
  };
}

function DocSearch({externalUrlRegex, ...props}: DocSearchV4Props) {
  const navigator = useNavigator({externalUrlRegex});
  const searchParameters = useSearchParameters({...props});
  const transformItems = useTransformItems(props);
  const transformSearchClient = useTransformSearchClient();

  const searchContainer = useRef<HTMLDivElement | null>(null);
  // TODO remove "as any" after React 19 upgrade
  const searchButtonRef = useRef<HTMLButtonElement>(null as any);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(
    undefined,
  );

  const {
    canHandleAskAi,
    isAskAiActive,
    currentPlaceholder,
    onAskAiToggle,
    askAi,
    resetAskAiActive,
  } = useAskAi(props, searchParameters);

  // Build extra props only when using DocSearch v4
  const extraAskAiProps: Partial<DocSearchModalV4Props> = useMemo(
    () =>
      isV4
        ? {
            // Ask-AI related props (v4 only)
            askAi,
            canHandleAskAi,
            isAskAiActive,
            onAskAiToggle,
          }
        : {},
    [askAi, canHandleAskAi, isAskAiActive, onAskAiToggle],
  );

  const prepareSearchContainer = useCallback(() => {
    if (!searchContainer.current) {
      const divElement = document.createElement('div');
      searchContainer.current = divElement;
      document.body.insertBefore(divElement, document.body.firstChild);
    }
  }, []);

  const openModal = useCallback(() => {
    prepareSearchContainer();
    importDocSearchModalIfNeeded().then(() => setIsOpen(true));
  }, [prepareSearchContainer]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    searchButtonRef.current?.focus();
    setInitialQuery(undefined);
    resetAskAiActive();
  }, [resetAskAiActive]);

  const handleInput = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
        // ignore browser's ctrl+f
        return;
      }
      // prevents duplicate key insertion in the modal input
      event.preventDefault();
      setInitialQuery(event.key);
      openModal();
    },
    [openModal],
  );

  const resultsFooterComponent = useResultsFooterComponent({closeModal});

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen: openModal,
    onClose: closeModal,
    onInput: handleInput,
    searchButtonRef,
    ...(isV4
      ? {
          isAskAiActive,
          onAskAiToggle,
        }
      : {}),
  });

  return (
    <>
      <Head>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          rel="preconnect"
          href={`https://${props.appId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
      </Head>

      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={openModal}
        ref={searchButtonRef}
        translations={props.translations?.button ?? translations.button}
      />

      {isOpen &&
        DocSearchModal &&
        // TODO need to fix this React Compiler lint error
        // eslint-disable-next-line react-compiler/react-compiler
        searchContainer.current &&
        createPortal(
          <DocSearchModal
            {...props}
            onClose={closeModal}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            transformSearchClient={transformSearchClient}
            {...(props.searchPagePath && {
              resultsFooterComponent,
            })}
            placeholder={currentPlaceholder}
            translations={props.translations?.modal ?? translations.modal}
            searchParameters={searchParameters}
            {...extraAskAiProps}
          />,
          // TODO need to fix this React Compiler lint error
          // eslint-disable-next-line react-compiler/react-compiler
          searchContainer.current,
        )}
    </>
  );
}

export default function SearchBar(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <DocSearch {...(siteConfig.themeConfig.algolia as DocSearchV4Props)} />
  );
}
