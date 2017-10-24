/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");
const fs = require("fs");
const Head = require("./Head.js");
const translation = require("../server/translation.js");

const CWD = process.cwd();

// Component used to provide same head, header, footer, other scripts to all pages
class Redirect extends React.Component {
  render() {
    const tagline = translation[this.props.language]
      ? translation[this.props.language]["localized-strings"].tagline
      : this.props.config.tagline;
    const title = this.props.title
      ? this.props.title + " · " + this.props.config.title
      : (!this.props.config.disableTitleTagline &&
          this.props.config.title + " · " + tagline) ||
        this.props.config.title;
    const description = this.props.description || tagline;
    const url =
      this.props.config.url +
      this.props.config.baseUrl +
      (this.props.url || "index.html");
    let latestVersion;

    const redirect = this.props.redirect || false;

    if (fs.existsSync(CWD + "/versions.json")) {
      latestVersion = require(CWD + "/versions.json")[0];
    }
    return (
      <html>
        <Head
          config={this.props.config}
          description={description}
          title={title}
          url={url}
          redirect={redirect}
        />
        <body className={this.props.className}>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                <!--
                window.location.href = "${this.props.redirect}";
                // -->
                `
            }}
          />
        </body>
      </html>
    );
  }
}
module.exports = Redirect;
