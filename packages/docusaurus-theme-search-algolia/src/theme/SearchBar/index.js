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
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import {DocSearchButton, useDocSearchKeyboardEvents} from '@docsearch/react';

let DocSearchModal = null;

function Hit({hit, children}) {
  return <Link to={hit.url}>{children}</Link>;
}

function ResultsFooter({state}) {
  return (
    <Link to={`/search?q=${state.query}`}>
      See {state.context.nbHits} results
    </Link>
  );
}

function DocSearch({indexName, appId, apiKey, searchParameters}) {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve();
    }

    return Promise.all([
      import('@docsearch/react/modal'),
      import('@docsearch/react/style'),
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
          href={`https://${appId}-dsn.algolia.net`}
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
            appId={appId}
            apiKey={apiKey}
            indexName={indexName}
            searchParameters={searchParameters}
            onClose={onClose}
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
                  url: `${a.pathname}${a.hash}`,
                };
              });
            }}
            hitComponent={Hit}
            resultsFooterComponent={ResultsFooter}
          />,
          document.body,
        )}
    </>
  );
}

function SearchBar() {
  const {siteConfig = {}} = useDocusaurusContext();

  if (!siteConfig.themeConfig.algolia) {
    // eslint-disable-next-line no-console
    console.warn(`DocSearch requires an \`algolia\` field in your \`themeConfig\`.

See: https://v2.docusaurus.io/docs/search/#using-algolia-docsearch`);

    return null;
  }

  return <DocSearch {...siteConfig.themeConfig.algolia} />;
}

export default SearchBar;
