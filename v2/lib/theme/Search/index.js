/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import './styles.css';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      enabled: true,
    };
  }

  componentDidMount() {
    const {siteConfig = {}, metadata = {}} = this.props;
    const {version: thisVersion, language: thisLanguage} = metadata;
    const {algolia} = siteConfig;

    if (window.docsearch) {
      window.docsearch({
        appId: algolia.appId,
        apiKey: algolia.apiKey,
        indexName: algolia.indexName,
        inputSelector: '#algolia-doc-search',
        algoliaOptions: JSON.parse(
          JSON.stringify(algolia.algoliaOptions)
            .replace('VERSION', thisVersion)
            .replace('LANGUAGE', thisLanguage),
        ),
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
        id="algolia-doc-search"
        type="search"
        placeholder="Search docs"
        aria-label="Search docs"
      />
    ) : null;
  }
}

export default Search;
