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

const splitTabsToTitleAndContent = (lines, indents) => {
  let first = false;
  let inBlock = false;
  let whitespace = false;
  const tc = [];
  let current = {
    content: [],
  };
  lines.forEach(line => {
    if (indents) {
      line = line.replace(new RegExp(`^((\\t|\\s{4}){${indents}})`, 'g'), '');
    }
    let pos = 0;
    const end = line.length;
    const isToken = (cline, cpos, ...chars) => {
      for (let i = 0; i < chars.length; i++) {
        if (cline.charCodeAt(cpos) !== chars[i]) {
          return false;
        }
        cpos++;
      }
      return true;
    };
    while (pos + 1 < end) {
      // Skip all the whitespace when we first start the scan.
      for (let max = end; pos < max; pos++) {
        if (line.charCodeAt(pos) !== 0x20 && line.charCodeAt(pos) !== 0x0a) {
          break;
        }
        whitespace = true;
      }
      // Check for the start of a comment: <!--
      // If we're in a code block we skip it.
      if (
        isToken(
          line,
          pos,
          0x3c /* < */,
          0x21 /* ! */,
          0x2d /* - */,
          0x2d /* - */,
        ) &&
        !inBlock
      ) {
        if (current !== null && current.title !== undefined) {
          tc.push({
            title: current.title,
            content: current.content.join('\n'),
          });
          current = {
            content: [],
          };
        }
        first = true;
        pos += 4;
        let b0;
        let b1;
        const buf = [];
        // Add all characters to the title buffer until
        // we reach the end marker: -->
        for (let max = end; pos < max; pos++) {
          const b = line.charCodeAt(pos);
          if (b0 === 0x2d /* - */ && b1 === 0x2d /* - */) {
            if (b !== 0x3e /* > */) {
              throw new Error(`Invalid comment sequence "--"`);
            }
            break;
          }
          buf.push(b);
          b0 = b1;
          b1 = b;
        }
        // Clear the line out before we add it to content.
        // This also means tabs can only be defined on a line by itself.
        line = '\n';
        // Trim the last 2 characters: --
        current.title = String.fromCharCode(...buf)
          .substring(0, buf.length - 2)
          .trim();
      }
      // If the first thing in a code tab is not a title it's invalid.
      if (!first) {
        throw new Error(`Invalid code tab markdown`);
      }
      // Check for code block: ```
      // If the line begins with whitespace we don't consider it a code block.
      if (
        isToken(line, pos, 0x60 /* ` */, 0x60 /* ` */, 0x60 /* ` */) &&
        !whitespace
      ) {
        pos += 3;
        inBlock = !inBlock;
      }
      pos++;
      whitespace = false;
    }
    current.content.push(line);
  });
  if (current !== null && current.title !== undefined) {
    tc.push({
      title: current.title,
      content: current.content.join('\n'),
    });
  }
  return tc;
};

const cleanTheCodeTag = (content, indents) => {
  const prepend = (line, indent) => {
    if (indent) {
      return '    '.repeat(indent) + line;
    }
    return line;
  };
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
    return prepend(c, indents);
  });
  return cleanContents.join('');
};

// inner doc component for article itself
class Doc extends React.Component {
  renderContent() {
    const {content} = this.props;
    let indents = 0;
    return content.replace(
      /(\t|\s{4})*?(<!--DOCUSAURUS_CODE_TABS-->\n)(.*?)((\n|\t|\s{4})<!--END_DOCUSAURUS_CODE_TABS-->)/gms,
      m => {
        const contents = m.split('\n').filter(c => {
          if (!indents) {
            indents = (
              c.match(/((\t|\s{4})+)<!--DOCUSAURUS_CODE_TABS-->/) || []
            ).length;
          }
          if (c.match(/(\t|\s{4})+<!--DOCUSAURUS_CODE_TABS-->/)) {
            return false;
          }
          if (
            c.match(
              /<!--END_DOCUSAURUS_CODE_TABS-->|<!--DOCUSAURUS_CODE_TABS-->/,
            ) ||
            (indents > 0 &&
              c.match(
                /(\t|\s{4})+(<!--END_DOCUSAURUS_CODE_TABS-->|<!--DOCUSAURUS_CODE_TABS-->)/,
              ))
          ) {
            return false;
          }
          return true;
        });
        if (indents) {
          indents -= 1;
        }
        const codeTabsMarkdownBlock = renderToStaticMarkup(
          <CodeTabsMarkdownBlock>
            {splitTabsToTitleAndContent(contents, indents)}
          </CodeTabsMarkdownBlock>,
        );
        return cleanTheCodeTag(codeTabsMarkdownBlock, indents);
      },
    );
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
