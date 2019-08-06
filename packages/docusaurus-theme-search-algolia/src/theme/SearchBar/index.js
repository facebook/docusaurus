/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Fragment} from 'react';

import DocusaurusContext from '@docusaurus/context';

import './styles.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true,
      isExpanded: false,
    };
    this.searchBarRef = React.createRef();
    this.toggleSearchIconClick = this.toggleSearchIconClick.bind(this);
  }

  componentDidMount() {
    const {siteConfig = {}} = this.context;
    const {
      themeConfig: {algolia},
    } = siteConfig;

    // https://github.com/algolia/docsearch/issues/352
    const isClient = typeof window !== 'undefined';
    if (isClient) {
      import('docsearch.js').then(({default: docsearch}) => {
        docsearch({
          appId: algolia.appId,
          apiKey: algolia.apiKey,
          indexName: algolia.indexName,
          inputSelector: '#search_input_react',
          algoliaOptions: algolia.algoliaOptions,
        });
      });
    } else {
      console.warn('Search has failed to load and now is being disabled');
      this.setState({enabled: false});
    }
  }

  toggleSearchIconClick() {
    this.setState(
      oldState => ({
        isExpanded: !oldState.isExpanded,
      }),
      () => {
        this.searchBarRef.current.focus();
        this.props.handleSearchBarToggle();
      },
    );
  }

  render() {
    const {enabled, isExpanded} = this.state;

    return enabled ? (
      <Fragment>
        <span
          role="button"
          className={`search-icon ${isExpanded ? 'search-icon-hidden' : ''}`}
          onClick={this.toggleSearchIconClick}
          onKeyDown={this.toggleSearchIconClick}
          tabIndex={0}
        />
        <input
          id="search_input_react"
          type="search"
          placeholder="Search"
          aria-label="Search"
          className={`${isExpanded ? 'search-bar-expanded' : 'search-bar'}`}
          onBlur={this.toggleSearchIconClick}
          ref={this.searchBarRef}
        />
      </Fragment>
    ) : null;
  }
}

Search.contextType = DocusaurusContext;

export default Search;
