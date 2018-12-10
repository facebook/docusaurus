/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const MarkdownBlock = require('./MarkdownBlock.js');

const translate = require('../server/translate.js').translate;

const editThisDoc = translate(
  'Edit this Doc|recruitment message asking to edit the doc source',
);
const translateThisDoc = translate(
  'Translate this Doc|recruitment message asking to translate the docs',
);

// inner doc component for article itself
class Doc extends React.Component {
  render() {
    let docSource = this.props.source;

    if (this.props.version && this.props.version !== 'next') {
      // If versioning is enabled and the current version is not next, we need to trim out "version-*" from the source if we want a valid edit link.
      docSource = docSource.match(new RegExp(/version-.*?\/(.*\.md)/, 'i'))[1];
    }

    const editUrl =
      this.props.metadata.custom_edit_url ||
      (this.props.config.editUrl && this.props.config.editUrl + docSource);
    let editLink = editUrl && (
      <a
        className="edit-page-link button"
        href={editUrl}
        target="_blank"
        rel="noreferrer noopener">
        {editThisDoc}
      </a>
    );

    // If internationalization is enabled, show Recruiting link instead of Edit Link.
    if (
      this.props.language &&
      this.props.language !== 'en' &&
      this.props.config.translationRecruitingLink
    ) {
      editLink = (
        <a
          className="edit-page-link button"
          href={`${this.props.config.translationRecruitingLink}/${
            this.props.language
          }`}
          target="_blank"
          rel="noreferrer noopener">
          {translateThisDoc}
        </a>
      );
    }

    return (
      <div className="post">
        <header className="postHeader">
          {editLink}
          {!this.props.hideTitle && (
            <h1 className="postHeaderTitle">{this.props.title}</h1>
          )}
        </header>
        <article>
          <MarkdownBlock>{this.props.content}</MarkdownBlock>
        </article>
      </div>
    );
  }
}

module.exports = Doc;
