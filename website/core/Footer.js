/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const GitHubButton = props => (
  <a
    className="github-button" // part of the https://buttons.github.io/buttons.js script in siteConfig.js
    href={`https://github.com/${props.config.organizationName}/${props.config.projectName}`}
    data-icon="octicon-star"
    data-count-href={`/${props.config.organizationName}/${props.config.projectName}/stargazers`}
    data-count-api={`/repos/${props.config.organizationName}/${props.config.projectName}#stargazers_count`}
    data-count-aria-label="# stargazers on GitHub"
    aria-label="Star this project on GitHub"
  >
    Star
  </a>
);

GitHubButton.propTypes = {
  config: React.PropTypes.object
};

class Footer extends React.Component {
  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          {this.props.config.footerIcon && (
            <a href={this.props.config.baseUrl} className="nav-home">
              <img
                src={`${this.props.config.baseUrl}${this.props.config
                  .footerIcon}`}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            </a>
          )}
          <div>
            <h5>Docs</h5>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${this.props.language}/installation.html`}
            >
              Getting Started
            </a>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${this.props.language}/versioning.html`}
            >
              Versioning
            </a>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${this.props.language}/translation.html`}
            >
              Localization
            </a>
            <a
              href={`
                ${this.props.config.baseUrl}docs/${this.props.language}/search.html`}
            >
              Adding Search
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href={`${this.props.config.baseUrl}${this.props
                .language}/users.html`}
            >
              User Showcase
            </a>
            <a href="https://twitter.com/docusaurus">
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/facebook/docusaurus">
              GitHub
            </a>
            <GitHubButton config={this.props.config} />
          </div>
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
