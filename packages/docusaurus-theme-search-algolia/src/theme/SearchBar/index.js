/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DocusaurusContext from '@docusaurus/context';

import './styles.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true,
    };
  }

  componentDidMount() {
    const {siteConfig = {}} = this.context;
    const {
      themeConfig: {algolia},
    } = siteConfig;

    // https://github.com/algolia/docsearch/issues/352
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      // Temporary workaround for a11y issue
      // https://github.com/algolia/docsearch/issues/418#
      const docsearchInput = document.querySelector('#search_input_react');
      const ariaLabel = docsearchInput.getAttribute('aria-label');

      import('docsearch.js').then(({default: docsearch}) => {
        docsearch({
          appId: algolia.appId,
          apiKey: algolia.apiKey,
          indexName: algolia.indexName,
          inputSelector: '#search_input_react',
          algoliaOptions: algolia.algoliaOptions,
        });
        docsearchInput.setAttribute('aria-label', ariaLabel);
      });
    } else {
      console.warn('Search has failed to load and now is being disabled');
      this.setState({enabled: false});
    }
  }

  render() {
    const {enabled} = this.state;

    return enabled ? (
      <input
        id="search_input_react"
        type="search"
        placeholder="Search"
        aria-label="Search"
      />
    ) : null;
  }
}

Search.contextType = DocusaurusContext;

export default Search;
