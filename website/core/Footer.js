/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            <img
              src={`${this.props.config.baseUrl}${this.props.config
                .footerIcon}`}
              alt={this.props.config.title}
              width="66"
              height="58"
            />
          </a>
          <div>
            <h5>Docs</h5>
            <a
              href={`
                ${this.props.config.baseUrl}docs/installation.html`}
            >
              Getting Started
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
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/facebookexperimental/docusaurus">
              GitHub
            </a>
            <a
              className="github-button"
              href="https://github.com/facebookexperimental/docusaurus"
              data-icon="octicon-star"
              data-show-count="true"
              aria-label="Star this project on GitHub"
            >
              Star
            </a>
          </div>
        </section>

        <a
          href="https://code.facebook.com/projects/"
          target="_blank"
          className="fbOpenSource"
        >
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
