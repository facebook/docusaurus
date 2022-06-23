/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useRef, useCallback, useMemo} from 'react';
import {createPortal} from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import {isRegexpStringMatch, useSearchPage} from '@docusaurus/theme-common';
import {DocSearchButton, useDocSearchKeyboardEvents} from '@docsearch/react';
import {useAlgoliaContextualFacetFilters} from '@docusaurus/theme-search-algolia/client';
import Translate, {translate} from '@docusaurus/Translate';

import type {
  DocSearchModal as DocSearchModalType,
  DocSearchModalProps,
  DocSearchTranslations,
} from '@docsearch/react';
import type {
  InternalDocSearchHit,
  StoredDocSearchHit,
} from '@docsearch/react/dist/esm/types';
import type {SearchClient} from 'algoliasearch/lite';
import type {AutocompleteState} from '@algolia/autocomplete-core';

type DocSearchProps = Omit<
  DocSearchModalProps,
  'onClose' | 'initialScrollY'
> & {
  contextualSearch?: string;
  externalUrlRegex?: string;
  searchPagePath: boolean | string;
};

let DocSearchModal: typeof DocSearchModalType | null = null;

function Hit({
  hit,
  children,
}: {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: React.ReactNode;
}) {
  return <Link to={hit.url}>{children}</Link>;
}

type ResultsFooterProps = {
  state: AutocompleteState<InternalDocSearchHit>;
  onClose: () => void;
};

function ResultsFooter({state, onClose}: ResultsFooterProps) {
  const {generateSearchPageLink} = useSearchPage();

  return (
    <Link to={generateSearchPageLink(state.query)} onClick={onClose}>
      <Translate
        id="theme.SearchBar.seeAll"
        values={{count: state.context.nbHits}}>
        {'See all {count} results'}
      </Translate>
    </Link>
  );
}

type FacetFilters = Required<
  Required<DocSearchProps>['searchParameters']
>['facetFilters'];

function mergeFacetFilters(f1: FacetFilters, f2: FacetFilters): FacetFilters {
  const normalize = (
    f: FacetFilters,
  ): readonly string[] | readonly (string | readonly string[])[] =>
    typeof f === 'string' ? [f] : f;
  return [...normalize(f1), ...normalize(f2)] as FacetFilters;
}

function DocSearch({
  contextualSearch,
  externalUrlRegex,
  ...props
}: DocSearchProps) {
  const {siteMetadata} = useDocusaurusContext();

  const contextualSearchFacetFilters =
    useAlgoliaContextualFacetFilters() as FacetFilters;

  const configFacetFilters: FacetFilters =
    props.searchParameters?.facetFilters ?? [];

  const facetFilters: FacetFilters = contextualSearch
    ? // Merge contextual search filters with config filters
      mergeFacetFilters(contextualSearchFacetFilters, configFacetFilters)
    : // ... or use config facetFilters
      configFacetFilters;

  // We let user override default searchParameters if she wants to
  const searchParameters: DocSearchProps['searchParameters'] = {
    ...props.searchParameters,
    facetFilters,
  };

  const {withBaseUrl} = useBaseUrlUtils();
  const history = useHistory();
  const searchContainer = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(
    undefined,
  );

  const importDocSearchModalIfNeeded = useCallback(() => {
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
  }, []);

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      searchContainer.current = document.createElement('div');
      document.body.insertBefore(
        searchContainer.current,
        document.body.firstChild,
      );
      setIsOpen(true);
    });
  }, [importDocSearchModalIfNeeded, setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    searchContainer.current?.remove();
  }, [setIsOpen]);

  const onInput = useCallback(
    (event: KeyboardEvent) => {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true);
        setInitialQuery(event.key);
      });
    },
    [importDocSearchModalIfNeeded, setIsOpen, setInitialQuery],
  );

  const navigator = useRef({
    navigate({itemUrl}: {itemUrl?: string}) {
      // Algolia results could contain URL's from other domains which cannot
      // be served through history and should navigate with window.location
      if (isRegexpStringMatch(externalUrlRegex, itemUrl)) {
        window.location.href = itemUrl!;
      } else {
        history.push(itemUrl!);
      }
    },
  }).current;

  const transformItems = useRef<DocSearchModalProps['transformItems']>(
    (items) =>
      items.map((item) => {
        // If Algolia contains a external domain, we should navigate without
        // relative URL
        if (isRegexpStringMatch(externalUrlRegex, item.url)) {
          return item;
        }

        // We transform the absolute URL into a relative URL.
        const url = new URL(item.url);
        return {
          ...item,
          url: withBaseUrl(`${url.pathname}${url.hash}`),
        };
      }),
  ).current;

  const resultsFooterComponent: DocSearchProps['resultsFooterComponent'] =
    useMemo(
      () =>
        // eslint-disable-next-line react/no-unstable-nested-components
        (footerProps: Omit<ResultsFooterProps, 'onClose'>): JSX.Element =>
          <ResultsFooter {...footerProps} onClose={onClose} />,
      [onClose],
    );

  const transformSearchClient = useCallback(
    (searchClient: SearchClient) => {
      searchClient.addAlgoliaAgent(
        'docusaurus',
        siteMetadata.docusaurusVersion,
      );

      return searchClient;
    },
    [siteMetadata.docusaurusVersion],
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  const translatedSearchLabel = translate({
    id: 'theme.SearchBar.label',
    message: 'Search',
    description: 'The ARIA label and placeholder for search button',
  });

  const translatedModal: DocSearchTranslations = {
    modal: {
      searchBox: {
        resetButtonTitle: translate({
          id: 'theme.SearchModal.searchBox.resetButtonTitle',
          message: 'Clear the query',
          description: 'The label for search box reset button',
        }),
        resetButtonAriaLabel: translate({
          id: 'theme.SearchModal.searchBox.resetButtonAriaLabel',
          message: 'Clear the query',
          description: 'The ARIA label for search box reset button',
        }),
        cancelButtonText: translate({
          id: 'theme.SearchModal.searchBox.cancelButtonText',
          message: 'Cancel',
          description: 'The label for search box cancel button',
        }),
        cancelButtonAriaLabel: translate({
          id: 'theme.SearchModal.searchBox.cancelButtonAriaLabel',
          message: 'Cancel',
          description: 'The ARIA label for search box cancel button',
        }),
      },
      startScreen: {
        recentSearchesTitle: translate({
          id: 'theme.SearchModal.startScreen.recentSearchesTitle',
          message: 'Recent',
          description: 'The title for recent searches',
        }),
        noRecentSearchesText: translate({
          id: 'theme.SearchModal.startScreen.noRecentSearchesText',
          message: 'No recent searches',
          description: 'The text when no recent searches',
        }),
        saveRecentSearchButtonTitle: translate({
          id: 'theme.SearchModal.startScreen.saveRecentSearchButtonTitle',
          message: 'Save this search',
          description: 'The label for save recent search button',
        }),
        removeRecentSearchButtonTitle: translate({
          id: 'theme.SearchModal.startScreen.removeRecentSearchButtonTitle',
          message: 'Remove this search from history',
          description: 'The label for remove recent search button',
        }),
        favoriteSearchesTitle: translate({
          id: 'theme.SearchModal.startScreen.favoriteSearchesTitle',
          message: 'Favorite',
          description: 'The title for favorite searches',
        }),
        removeFavoriteSearchButtonTitle: translate({
          id: 'theme.SearchModal.startScreen.removeFavoriteSearchButtonTitle',
          message: 'Remove this search from favorites',
          description: 'The label for remove favorite search button',
        }),
      },
      errorScreen: {
        titleText: translate({
          id: 'theme.SearchModal.errorScreen.titleText',
          message: 'Unable to fetch results',
          description: 'The title for error screen of search modal',
        }),
        helpText: translate({
          id: 'theme.SearchModal.errorScreen.helpText',
          message: 'You might want to check your network connection.',
          description: 'The help text for error screen of search modal',
        }),
      },
      footer: {
        selectText: translate({
          id: 'theme.SearchModal.footer.selectText',
          message: 'to select',
          description: 'The explanatory text of the action for the enter key',
        }),
        selectKeyAriaLabel: translate({
          id: 'theme.SearchModal.footer.selectKeyAriaLabel',
          message: 'Enter key',
          description:
            'The ARIA label for the Enter key button that makes the selection',
        }),
        navigateText: translate({
          id: 'theme.SearchModal.footer.navigateText',
          message: 'to navigate',
          description:
            'The explanatory text of the action for the Arrow up and Arrow down key',
        }),
        navigateUpKeyAriaLabel: translate({
          id: 'theme.SearchModal.footer.navigateUpKeyAriaLabel',
          message: 'Arrow up',
          description:
            'The ARIA label for the Arrow up key button that makes the navigation',
        }),
        navigateDownKeyAriaLabel: translate({
          id: 'theme.SearchModal.footer.navigateDownKeyAriaLabel',
          message: 'Arrow down',
          description:
            'The ARIA label for the Arrow down key button that makes the navigation',
        }),
        closeText: translate({
          id: 'theme.SearchModal.footer.closeText',
          message: 'to close',
          description: 'The explanatory text of the action for Escape key',
        }),
        closeKeyAriaLabel: translate({
          id: 'theme.SearchModal.footer.closeKeyAriaLabel',
          message: 'Escape key',
          description:
            'The ARIA label for the Escape key button that close the modal',
        }),
        searchByText: translate({
          id: 'theme.SearchModal.footer.searchByText',
          message: 'Search by',
          description: 'The text explain that the search is making by Algolia',
        }),
      },
      noResultsScreen: {
        noResultsText: translate({
          id: 'theme.SearchModal.noResultsScreen.noResultsText',
          message: 'No results for',
          description:
            'The text explains that there are no results for the following search',
        }),
        suggestedQueryText: translate({
          id: 'theme.SearchModal.noResultsScreen.suggestedQueryText',
          message: 'Try searching for',
          description:
            'The text for the suggested query when no results are found for the following search',
        }),
        reportMissingResultsText: translate({
          id: 'theme.SearchModal.noResultsScreen.reportMissingResultsText',
          message: 'Believe this query should return results?',
          description:
            'The text for the question where the user thinks there are missing results',
        }),
        reportMissingResultsLinkText: translate({
          id: 'theme.SearchModal.noResultsScreen.reportMissingResultsLinkText',
          message: 'Let us know.',
          description: 'The text for the link to report missing results',
        }),
      },
    },
  };

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
        onClick={onOpen}
        ref={searchButtonRef}
        translations={{
          buttonText: translatedSearchLabel,
          buttonAriaLabel: translatedSearchLabel,
        }}
      />

      {isOpen &&
        DocSearchModal &&
        searchContainer.current &&
        createPortal(
          <DocSearchModal
            onClose={onClose}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            transformSearchClient={transformSearchClient}
            {...(props.searchPagePath && {
              resultsFooterComponent,
            })}
            {...props}
            searchParameters={searchParameters}
            translations={translatedModal}
          />,
          searchContainer.current,
        )}
    </>
  );
}

export default function SearchBar(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return <DocSearch {...(siteConfig.themeConfig.algolia as DocSearchProps)} />;
}
