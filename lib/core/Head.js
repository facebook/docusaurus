/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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
    let sourceCodeButton = this.props.config.sourceCodeButton;
    // defaults to github, but other values may be allowed in the future
    let includeGithubButton =
      sourceCodeButton === "github" || sourceCodeButton == null;
    return (
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <title>{this.props.title}</title>
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content="Docusaurus" />
        <meta property="og:title" content={this.props.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={this.props.url} />
        <meta property="og:description" content={this.props.description} />
        {this.props.config.noIndex && <meta name="robots" content="noindex" />}
        {this.props.config.ogImage && (
          <meta
            property="og:image"
            content={this.props.config.baseUrl + this.props.config.ogImage}
          />
        )}
        {this.props.redirect && (
          <meta
            http-equiv="refresh"
            content={"2; URL=" + this.props.redirect}
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
        {includeGithubButton && (
          <script async defer src="https://buttons.github.io/buttons.js" />
        )}
        <script
          type="text/javascript"
          src={this.props.config.baseUrl + "js/webplayer.js"}
        />
        <script type="text/javascript" src="https://snack.expo.io/embed.js" />
      </head>
    );
  }
}

module.exports = Head;
