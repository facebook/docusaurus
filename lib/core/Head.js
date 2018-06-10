/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

// html head for each page
class Head extends React.Component {
  render() {
    const links = this.props.config.headerLinks;
    let hasBlog = false;
    links.map(link => {
      if (link.blog) hasBlog = true;
    });

    let highlight = {
      version: '9.12.0',
      theme: 'default',
      ...this.props.config.highlight,
    };

    // Use user-provided themeUrl if it exists, else construct one from version and theme.
    let highlightThemeURL = highlight.themeUrl
      ? highlight.themeUrl
      : `//cdnjs.cloudflare.com/ajax/libs/highlight.js/${
          highlight.version
        }/styles/${highlight.theme}.min.css`;

    return (
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>{this.props.title}</title>
        <meta name="viewport" content="width=device-width" />
        <meta name="generator" content="Docusaurus" />
        <meta name="description" content={this.props.description} />
        <meta property="og:title" content={this.props.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={this.props.url} />
        <meta property="og:description" content={this.props.description} />
        {this.props.config.ogImage && (
          <meta
            property="og:image"
            content={
              this.props.config.url +
              this.props.config.baseUrl +
              this.props.config.ogImage
            }
          />
        )}
        <meta name="twitter:card" content="summary" />
        {this.props.config.twitterImage && (
          <meta
            name="twitter:image"
            content={
              this.props.config.url +
              this.props.config.baseUrl +
              this.props.config.twitterImage
            }
          />
        )}
        {this.props.config.noIndex && <meta name="robots" content="noindex" />}
        {this.props.redirect && (
          <meta httpEquiv="refresh" content={'0; URL=' + this.props.redirect} />
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
        <link rel="stylesheet" href={highlightThemeURL} />
        {hasBlog && (
          <link
            rel="alternate"
            type="application/atom+xml"
            href={this.props.config.url + '/blog/atom.xml'}
            title={this.props.config.title + ' Blog ATOM Feed'}
          />
        )}
        {hasBlog && (
          <link
            rel="alternate"
            type="application/rss+xml"
            href={this.props.config.url + '/blog/feed.xml'}
            title={this.props.config.title + ' Blog RSS Feed'}
          />
        )}
        {this.props.config.gaTrackingId &&
          this.props.config.gaGtag && (
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${
                this.props.config.gaTrackingId
              }`}
            />
          )}
        {this.props.config.gaTrackingId &&
          this.props.config.gaGtag && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${this.props.config.gaTrackingId}');
            `,
              }}
            />
          )}
        {this.props.config.gaTrackingId &&
          !this.props.config.gaGtag && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', '${this.props.config.gaTrackingId}', 'auto');
              ga('send', 'pageview');
            `,
              }}
            />
          )}

        {/* External resources */}
        {this.props.config.stylesheets &&
          this.props.config.stylesheets.map(function(source, idx) {
            return (
              <link rel="stylesheet" key={'stylesheet' + idx} href={source} />
            );
          })}
        {this.props.config.scripts &&
          this.props.config.scripts.map(function(source, idx) {
            return (
              <script
                type="text/javascript"
                key={'script' + idx}
                src={source}
              />
            );
          })}

        {this.props.config.scrollToTop && (
          <script
            src={
              'https://unpkg.com/vanilla-back-to-top@7.1.14/dist/vanilla-back-to-top.min.js'
            }
          />
        )}
        {this.props.config.scrollToTop && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
        document.addEventListener("DOMContentLoaded", function(){
          addBackToTop(
            ${JSON.stringify(
              Object.assign(
                {},
                {zIndex: 100},
                this.props.config.scrollToTopOptions
              )
            )}
          )
        });
        `,
            }}
          />
        )}
        {this.props.config.usePrism && (
          <link
            rel="stylesheet"
            href={this.props.config.baseUrl + 'css/prism.css'}
          />
        )}
        {/* Site defined code. Keep these at the end to avoid overriding. */}
        <link
          rel="stylesheet"
          href={this.props.config.baseUrl + 'css/main.css'}
        />
      </head>
    );
  }
}

module.exports = Head;
