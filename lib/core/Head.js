/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");

// html head for each page
class Head extends React.Component {
  render() {
    let links = this.props.config.headerLinks;
    let hasBlog = false;
    links.map(link => {
      if (link.blog) hasBlog = true;
    });
    return (
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <title>{this.props.title}</title>
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content={this.props.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={this.props.url} />
        <meta property="og:description" content={this.props.description} />
        <meta name="robots" content="noindex" />
        {this.props.config.ogImage && (
          <meta
            property="og:image"
            content={this.props.config.baseUrl + this.props.config.ogImage}
          />
        )}
        <link
          rel="shortcut icon"
          href={this.props.config.baseUrl + this.props.config.favicon}
        />
        {this.props.config.algolia && (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css"
          />
        )}
        <link
          rel="stylesheet"
          href={this.props.config.baseUrl + "css/main.css"}
        />
        {hasBlog && (
          <link
            rel="alternate"
            type="application/atom+xml"
            href={this.props.config.url + "/blog/atom.xml"}
            title={this.props.config.title + " Blog ATOM Feed"}
          />
        )}{" "}
        {hasBlog && (
          <link
            rel="alternate"
            type="application/rss+xml"
            href={this.props.config.url + "/blog/feed.xml"}
            title={this.props.config.title + " Blog RSS Feed"}
          />
        )}
        <script async defer src="https://buttons.github.io/buttons.js" />
      </head>
    );
  }
}

module.exports = Head;
