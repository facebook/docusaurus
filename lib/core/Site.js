/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const fs = require('fs');
const classNames = require('classnames');

const HeaderNav = require('./nav/HeaderNav.js');
const Head = require('./Head.js');
const Footer = require(process.cwd() + '/core/Footer.js');
const translation = require('../server/translation.js');
const constants = require('./constants');

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
    let docsVersion = this.props.version || 'current';

    if (fs.existsSync(CWD + '/versions.json')) {
      const latestVersion = require(CWD + '/versions.json')[0];
      if (docsVersion === latestVersion) {
        docsVersion = 'current';
      }
    }

    // We do not want a lang attribute for the html tag if we don't have a language set
    const htmlElementProps = {};
    if (this.props.language) {
      htmlElementProps.lang = this.props.language;
    }

    return (
      <html {...htmlElementProps}>
        <Head
          config={this.props.config}
          description={description}
          title={title}
          url={url}
          language={this.props.language}
          version={this.props.version}
        />
        <body className={this.props.className}>
          <HeaderNav
            config={this.props.config}
            baseUrl={this.props.config.baseUrl}
            title={this.props.config.title}
            language={this.props.language}
            version={this.props.version}
            current={this.props.metadata}
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
          {this.props.config.facebookPixelId && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${this.props.config.facebookPixelId}');
              fbq('track', 'PageView');
                `,
              }}
            />
          )}
          {(this.props.config.twitter || this.props.config.twitterUsername) && (
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
                ${
                  this.props.config.algolia.appId
                    ? `appId: '${this.props.config.algolia.appId}',`
                    : ''
                }
                apiKey: '${this.props.config.algolia.apiKey}',
                indexName: '${this.props.config.algolia.indexName}',
                inputSelector: '#search_input_react',
                algoliaOptions: ${JSON.stringify(
                  this.props.config.algolia.algoliaOptions
                )
                  .replace('VERSION', docsVersion)
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
                ${
                  this.props.config.algolia.appId
                    ? `appId: '${this.props.config.algolia.appId}',`
                    : ''
                }
                apiKey: '${this.props.config.algolia.apiKey}',
                indexName: '${this.props.config.algolia.indexName}',
                inputSelector: '#search_input_react'
              });
            `,
                }}
              />
            ))}

          {process.env.NODE_ENV === 'development' && (
            <script
              src={`http://localhost:${
                constants.LIVE_RELOAD_PORT
              }/livereload.js`}
            />
          )}
        </body>
      </html>
    );
  }
}
module.exports = Site;
