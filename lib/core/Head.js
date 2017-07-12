/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require("react");

class Head extends React.Component {
  render() {
    /*
        <meta property="og:image" content={this.props.config.baseUrl + "img/opengraph.png"} />

        <link rel="apple-touch-icon" sizes="180x180" href={this.props.config.baseUrl + "img/favicon/apple-touch-icon.png"} />
        <link rel="icon" type="image/png" sizes="32x32" href={this.props.config.baseUrl + "img/favicon/favicon-32x32.png"} />
        <link rel="icon" type="image/png" sizes="16x16" href={this.props.config.baseUrl + "img/favicon/favicon-16x16.png"} />
        <link rel="manifest" href={this.props.config.baseUrl + "img/favicon/manifest.json"} />
        <link rel="mask-icon" href={this.props.config.baseUrl + "img/favicon/safari-pinned-tab.svg"} color="#5bbad5" />
        <link rel="shortcut icon" href={this.props.config.baseUrl + "img/favicon/favicon.ico"} />
        <meta name="msapplication-config" content={this.props.config.baseUrl + "img/favicon/browserconfig.xml"} />
        <meta name="theme-color" content={this.props.config.primaryColor} />

    */

    return (
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge, chrome=1" />
        <title>
          {this.props.title}
        </title>
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content={this.props.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={this.props.url} />
        <meta property="og:description" content={this.props.description} />

        <link
          rel="shortcut icon"
          href={this.props.config.baseUrl + this.props.config.favicon}
        />
        {this.props.config.algolia &&
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css"
          />}
        <link
          rel="stylesheet"
          href={this.props.config.baseUrl + "css/main.css"}
        />
        <script async defer src="https://buttons.github.io/buttons.js" />
      </head>
    );
  }
}

module.exports = Head;
