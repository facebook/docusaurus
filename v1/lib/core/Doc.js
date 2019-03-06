/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const MarkdownBlock = require('./MarkdownBlock.js');
const CodeTabsMarkdownBlock = require('./CodeTabsMarkdownBlock.js');

const translate = require('../server/translate.js').translate;

const editThisDoc = translate(
  'Edit this Doc|recruitment message asking to edit the doc source',
);
const translateThisDoc = translate(
  'Translate this Doc|recruitment message asking to translate the docs',
);

const splitTabsToTitleAndContent = content => {
  const titles = content.match(/<!--(.*?)-->/gms);
  const tabs = content.split(/<!--.*?-->/gms);
  if (!titles || !tabs || !titles.length || !tabs.length) {
    return [];
  }
  tabs.shift();
  return titles.map((title, idx) => ({
    title: title.substring(4, title.length - 3).trim(),
    content: tabs[idx],
  }));
};

const cleanTheCodeTag = content => {
  const contents = content.split(/(<pre>)(.*?)(<\/pre>)/gms);
  let inCodeBlock = false;
  const cleanContents = contents.map(c => {
    if (c === '<pre>') {
      inCodeBlock = true;
      return c;
    }
    if (c === '</pre>') {
      inCodeBlock = false;
      return c;
    }
    if (inCodeBlock) {
      return c.replace(/\n/g, '<br />');
    }
    return c;
  });
  return cleanContents.join('');
};

// inner doc component for article itself
class Doc extends React.Component {
  renderContent() {
    const {content} = this.props;
    let inCodeTabs = false;
    const contents = content.split(
      /(<!--DOCUSAURUS_CODE_TABS-->\n)(.*?)(\n<!--END_DOCUSAURUS_CODE_TABS-->)/gms,
    );

    const renderResult = contents.map(c => {
      if (c === '<!--DOCUSAURUS_CODE_TABS-->\n') {
        inCodeTabs = true;
        return '';
      }
      if (c === '\n<!--END_DOCUSAURUS_CODE_TABS-->') {
        inCodeTabs = false;
        return '';
      }
      if (inCodeTabs) {
        const codeTabsMarkdownBlock = renderToStaticMarkup(
          <CodeTabsMarkdownBlock>
            {splitTabsToTitleAndContent(c)}
          </CodeTabsMarkdownBlock>,
        );
        return cleanTheCodeTag(codeTabsMarkdownBlock);
      }
      return c;
    });

    return renderResult.join('');
  }

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
          <MarkdownBlock>{this.renderContent()}</MarkdownBlock>
        </article>
      </div>
    );
  }
}

module.exports = Doc;
