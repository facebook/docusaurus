/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const HeaderNav = require('./nav/HeaderNav.js');
const Head = require('./Head.js');
const Footer = require(process.cwd() + '/core/Footer.js');

class Site extends React.Component {
  /*
  goes in body after navPusher

  <div id="fb-root" />
  <script
    type="text/javascript"
    src="https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js"
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-44373548-17', 'auto');
    ga('send', 'pageview');

    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)
    ){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

    docsearch({
      apiKey: '833906d7486e4059359fa58823c4ef56',
      indexName: 'jest',
      inputSelector: '#search_input_react'
    });
  `,
    }}
  />

  */

  render() {
    const tagline = this.props.config[this.props.language] ? this.props.config[this.props.language].tagline : this.props.config.tagline;
    const title = this.props.title
      ? this.props.title + ' · ' + this.props.config.title
      : this.props.config.title + ' · ' + tagline;
    const description =
      this.props.description || tagline;
    const url =
      this.props.config.url + this.props.config.baseUrl + (this.props.url || 'index.html');

    return (
      <html>
        <Head config={this.props.config} description={description} title={title} url={url} />
        <body className={this.props.className}>
          <HeaderNav
            config={this.props.config}
            baseUrl={this.props.config.baseUrl}
            section={this.props.section}
            title={this.props.config.title}
            language={this.props.language}
          />
          <div className="navPusher">
            {this.props.children}
            <Footer config={this.props.config} language={this.props.language} />
          </div>
          {this.props.config.algolia &&
            <script
              type="text/javascript"
              src="//cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js"
            />
          }
          {this.props.config.gaTrackingId &&
            <script
              dangerouslySetInnerHTML={{
                __html: `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', '` + this.props.config.gaTrackingId + `', 'auto');
              ga('send', 'pageview');
            `,
              }}
            />
          }
          {this.props.config.algolia &&
            <script
              dangerouslySetInnerHTML={{
                __html: `
              var search = docsearch({
                apiKey: '` + this.props.config.algolia.apiKey + `',
                indexName: '` + this.props.config.algolia.indexName + `',
                inputSelector: '#search_input_react'
              });
            `,
              }}
            />
          }
        </body>
      </html>
    );
  }
}
module.exports = Site;
