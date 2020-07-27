/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';
import {createPortal} from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useHistory} from '@docusaurus/router';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useSearchQuery from '@theme/hooks/useSearchQuery';
import {DocSearchButton, useDocSearchKeyboardEvents} from '@docsearch/react';

let DocSearchModal = null;

function Hit({hit, children}) {
  return <Link to={hit.url}>{children}</Link>;
}

function ResultsFooter({state, onClose}) {
  const {generateSearchPageLink} = useSearchQuery();

  return (
    <Link to={generateSearchPageLink(state.query)} onClick={onClose}>
      See all {state.context.nbHits} results
    </Link>
  );
}

function DocSearch(props) {
  const {siteMetadata} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve();
    }

    return Promise.all([
      import('@docsearch/react/modal'),
      import('@docsearch/react/style'),
      import('./styles.css'),
    ]).then(([{DocSearchModal: Modal}]) => {
      DocSearchModal = Modal;
    });
  }, []);

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      setIsOpen(true);
    });
  }, [importDocSearchModalIfNeeded, setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useDocSearchKeyboardEvents({isOpen, onOpen, onClose});

  return (
    <>
      <Head>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          rel="preconnect"
          href={`https://${props.appId}-dsn.algolia.net`}
          crossOrigin
        />
      </Head>

      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={onOpen}
      />

      {isOpen &&
        createPortal(
          <DocSearchModal
            onClose={onClose}
            initialScrollY={window.scrollY}
            navigator={{
              navigate({suggestionUrl}) {
                history.push(suggestionUrl);
              },
            }}
            transformItems={(items) => {
              return items.map((item) => {
                // We transform the absolute URL into a relative URL.
                // Alternatively, we can use `new URL(item.url)` but it's not
                // supported in IE.
                const a = document.createElement('a');
                a.href = item.url;

                return {
                  ...item,
                  url: withBaseUrl(`${a.pathname}${a.hash}`),
                };
              });
            }}
            hitComponent={Hit}
            resultsFooterComponent={(footerProps) => (
              <ResultsFooter {...footerProps} onClose={onClose} />
            )}
            transformSearchClient={(searchClient) => {
              searchClient.addAlgoliaAgent(
                'docusaurus',
                siteMetadata.docusaurusVersion,
              );

              return searchClient;
            }}
            {...props}
          />,
          document.body,
        )}
    </>
  );
}

function SearchBar() {
  const {siteConfig} = useDocusaurusContext();
  return <DocSearch {...siteConfig.themeConfig.algolia} />;
}

export default SearchBar;
