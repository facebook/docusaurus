/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");
const Container = require("./Container.js");
const Doc = require("./Doc.js");
const DocsSidebar = require("./DocsSidebar.js");
const Site = require("./Site.js");
const translation = require("../server/translation.js");

// component used to generate whole webpage for docs, including sidebar/header/footer
class DocsLayout extends React.Component {
  render() {
    const metadata = this.props.metadata;
    const content = this.props.children;
    const i18n = translation[this.props.metadata.language];
    let DocComponent = Doc;
    if (this.props.Doc) {
      DocComponent = this.props.Doc;
    }
    return (
      <Site
        config={this.props.config}
        className="sideNavVisible"
        title={
          i18n
            ? translation[this.props.metadata.language]["localized-strings"][
                this.props.metadata.localized_id
              ] || this.props.metadata.title
            : this.props.metadata.title
        }
        description={content.trim().split("\n")[0]}
        language={metadata.language}
        version={metadata.version}>
        <div className="docMainWrapper wrapper">
          <DocsSidebar metadata={metadata} />
          <Container className="mainContainer">
            <DocComponent
              metadata={metadata}
              content={content}
              config={this.props.config}
              source={metadata.source}
              title={
                i18n
                  ? translation[this.props.metadata.language][
                      "localized-strings"
                    ][this.props.metadata.localized_id] ||
                    this.props.metadata.title
                  : this.props.metadata.title
              }
              language={metadata.language}
            />
            <div className="docs-prevnext">
              {metadata.previous_id && (
                <a
                  className="docs-prev button"
                  href={metadata.previous_id + ".html"}>
                  ←{" "}
                  {i18n
                    ? translation[this.props.metadata.language][
                        "localized-strings"
                      ][metadata.previous_id] ||
                      translation[this.props.metadata.language][
                        "localized-strings"
                      ]["previous"] ||
                      "Previous"
                    : metadata.previous_id || "Previous"
                  }
                </a>
              )}
              {metadata.next_id && (
                <a
                  className="docs-next button"
                  href={metadata.next_id + ".html"}>
                  {i18n
                    ? translation[this.props.metadata.language][
                        "localized-strings"
                      ][metadata.next_id] ||
                      translation[this.props.metadata.language][
                        "localized-strings"
                      ]["next"] ||
                      "Next"
                    : metadata.next_id || "Next"
                  }{" "}
                  →
                </a>
              )}
            </div>
          </Container>
        </div>
      </Site>
    );
  }
}
module.exports = DocsLayout;
