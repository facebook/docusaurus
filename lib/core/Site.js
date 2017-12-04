/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const fs = require('fs');
const HeaderNav = require('./nav/HeaderNav.js');
const Head = require('./Head.js');
const Footer = require(process.cwd() + '/core/Footer.js');
const translation = require('../server/translation.js');

const CWD = process.cwd();

// Component used to provide same head, header, footer, other scripts to all pages
class Site extends React.Component {
  render() {
    const tagline = translation[this.props.language]
      ? translation[this.props.language]['localized-strings'].tagline
      : this.props.config.tagline;
    const title = this.props.title
      ? this.props.title + ' · ' + this.props.config.title
      : (!this.props.config.disableTitleTagline &&
          this.props.config.title + ' · ' + tagline) ||
        this.props.config.title;
    const description = this.props.description || tagline;
    const url =
      this.props.config.url +
      this.props.config.baseUrl +
      (this.props.url || 'index.html');
    let latestVersion;

    const highlightDefaultVersion = '9.12.0';
    const highlightConfig = this.props.config.highlight || {
      version: highlightDefaultVersion,
      theme: 'default',
    };
    const highlightVersion = highlightConfig.version || highlightDefaultVersion;
    if (fs.existsSync(CWD + '/versions.json')) {
      latestVersion = require(CWD + '/versions.json')[0];
    }
    return (
      <html>
        <Head
          config={this.props.config}
          description={description}
          title={title}
          url={url}
        />
        <body className={this.props.className}>
          <HeaderNav
            config={this.props.config}
            baseUrl={this.props.config.baseUrl}
            title={this.props.config.title}
            language={this.props.language}
            version={this.props.version}
          />
          <div className="navPusher">
            {this.props.children}
            <Footer config={this.props.config} language={this.props.language} />
          </div>
          {this.props.config.algolia && (
            <script
              type="text/javascript"
              src="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js"
            />
          )}
          {this.props.config.gaTrackingId && (
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
          {this.props.config.facebookAppId && (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.fbAsyncInit = function() {FB.init({appId:'${
                  this.props.config.facebookAppId
                }',xfbml:true,version:'v2.7'});};(function(d, s, id){var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) {return;}js = d.createElement(s); js.id = id;js.src = '//connect.facebook.net/en_US/sdk.js';fjs.parentNode.insertBefore(js, fjs);}(document, 'script','facebook-jssdk'));
                `,
              }}
            />
          )}
          {this.props.config.twitter && (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.twttr=(function(d,s, id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return t;js=d.createElement(s);js.id=id;js.src='https://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js, fjs);t._e = [];t.ready = function(f) {t._e.push(f);};return t;}(document, 'script', 'twitter-wjs'));`,
              }}
            />
          )}
          {this.props.config.algolia &&
            (this.props.config.algolia.algoliaOptions ? (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              var search = docsearch({
                apiKey: '${this.props.config.algolia.apiKey}',
                indexName: '${this.props.config.algolia.indexName}',
                inputSelector: '#search_input_react',
                algoliaOptions: ${JSON.stringify(
                  this.props.config.algolia.algoliaOptions
                )
                  .replace('VERSION', this.props.version || latestVersion)
                  .replace('LANGUAGE', this.props.language)}
              });
            `,
                }}
              />
            ) : (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              var search = docsearch({
                apiKey: '${this.props.config.algolia.apiKey}',
                indexName: '${this.props.config.algolia.indexName}',
                inputSelector: '#search_input_react'
              });
            `,
                }}
              />
            ))}
        </body>
      </html>
    );
  }
}
module.exports = Site;
