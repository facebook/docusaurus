/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");
const MarkdownBlock = require("./MarkdownBlock.js");

const translate = require("../server/translate.js").translate;

const editThisDoc = translate(
  "Edit this Doc|recruitment message asking to edit the doc source"
);
const translateThisDoc = translate(
  "Translate this Doc|recruitment message asking to translate the docs"
);

// inner doc component for article itself
class Doc extends React.Component {
  render() {
    let editLink = !this.props.version &&
      this.props.config.editUrl && (
        <a
          className="edit-page-link button"
          href={this.props.config.editUrl + this.props.source}
          target="_blank">
          {editThisDoc}
        </a>
      );
    if (this.props.language != "en") {
      editLink = !this.props.version &&
        this.props.config.translationRecruitingLink && (
          <a
            className="edit-page-link button"
            href={
              this.props.config.translationRecruitingLink +
              "/" +
              this.props.language
            }
            target="_blank">
            {translateThisDoc}
          </a>
        );
    }
    return (
      <div className="post">
        <header className="postHeader">
          {editLink}
          <h1>{this.props.title}</h1>
        </header>
        <article>
          <MarkdownBlock>{this.props.content}</MarkdownBlock>
        </article>
      </div>
    );
  }
}

module.exports = Doc;
