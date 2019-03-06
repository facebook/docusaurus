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
    const {siteConfig = {}, metadata = {}} = this.context;
    const {version: thisVersion, language: thisLanguage} = metadata;
    const {algolia} = siteConfig;

    // https://github.com/algolia/docsearch/issues/352
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      import('docsearch.js').then(({default: docsearch}) => {
        docsearch({
          appId: algolia.appId,
          apiKey: algolia.apiKey,
          indexName: algolia.indexName,
          inputSelector: '#search_input_react',
          algoliaOptions: JSON.parse(
            JSON.stringify(algolia.algoliaOptions)
              .replace('VERSION', thisVersion)
              .replace('LANGUAGE', thisLanguage),
          ),
        });
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
        placeholder="Search docs"
        aria-label="Search docs"
      />
    ) : null;
  }
}

Search.contextType = DocusaurusContext;

export default Search;
