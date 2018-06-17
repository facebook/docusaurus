const PropTypes = require('prop-types');
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const SocialFooter = props => (
  <div className="footerSection">
    <h5>Social</h5>
    <div className="social">
      <a
        className="github-button" // part of the https://buttons.github.io/buttons.js script in siteConfig.js
        href={`https://github.com/${props.config.organizationName}/${
          props.config.projectName
        }`}
        data-count-href={`/${props.config.organizationName}/${
          props.config.projectName
        }/stargazers`}
        data-show-count="true"
        data-count-aria-label="# stargazers on GitHub"
        aria-label="Star this project on GitHub">
        {props.config.projectName}
      </a>
    </div>
    {props.config.twitterUsername && (
      <div className="social">
        <a
          href={`https://twitter.com/${props.config.twitterUsername}`}
          className="twitter-follow-button">
          Follow @{props.config.twitterUsername}
        </a>
      </div>
    )}
    {props.config.facebookAppId && (
      <div className="social">
        <div
          className="fb-like"
          data-href={props.config.url}
          data-layout="standard"
          data-share="true"
          data-width="225"
          data-show-faces="false"
        />
      </div>
    )}
  </div>
);

SocialFooter.propTypes = {
  config: PropTypes.object,
};

class Footer extends React.Component {
  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          {this.props.config.footerIcon && (
            <a href={this.props.config.baseUrl} className="nav-home">
              <img
                src={`${this.props.config.baseUrl}${
                  this.props.config.footerIcon
                }`}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            </a>
          )}
          <div className="footerSection">
            <h5>Docs</h5>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${
                this.props.language
              }/installation.html`}>
              Getting Started
            </a>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${
                this.props.language
              }/versioning.html`}>
              Versioning
            </a>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${
                this.props.language
              }/translation.html`}>
              Localization
            </a>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${
                this.props.language
              }/search.html`}>
              Adding Search
            </a>
          </div>
          <div className="footerSection">
            <h5>Community</h5>
            <a
              href={`${this.props.config.baseUrl}${
                this.props.language
              }/users.html`}>
              User Showcase
            </a>
          </div>
          <SocialFooter config={this.props.config} />
        </section>
        <a
          href="https://code.facebook.com/projects/"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/oss_logo.png`}
            alt="Facebook Open Source"
            width="170"
            height="45"
          />
        </a>
        <section className="copyright">
          {this.props.config.copyright && (
            <span>{this.props.config.copyright}</span>
          )}
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
