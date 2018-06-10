/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const Container = require('./Container.js');
const Doc = require('./Doc.js');
const DocsSidebar = require('./DocsSidebar.js');
const OnPageNav = require('./nav/OnPageNav.js');
const Site = require('./Site.js');
const translation = require('../server/translation.js');
const path = require('path');

// component used to generate whole webpage for docs, including sidebar/header/footer
class DocsLayout extends React.Component {
  getRelativeURL = (from, to) => {
    const extension = this.props.config.cleanUrl ? '' : '.html';
    return (
      path
        .relative(from, to)
        .replace('\\', '/')
        .replace(/^\.\.\//, '') + extension
    );
  };

  render() {
    const metadata = this.props.metadata;
    const content = this.props.children;
    const i18n = translation[this.props.metadata.language];
    let DocComponent = Doc;
    if (this.props.Doc) {
      DocComponent = this.props.Doc;
    }
    const title = i18n
      ? translation[this.props.metadata.language]['localized-strings'][
          this.props.metadata.localized_id
        ] || this.props.metadata.title
      : this.props.metadata.title;
    return (
      <Site
        config={this.props.config}
        className="sideNavVisible doc"
        title={title}
        description={content.trim().split('\n')[0]}
        language={metadata.language}
        version={metadata.version}
        metadata={metadata}>
        <div className="docMainWrapper wrapper">
          <DocsSidebar metadata={metadata} />
          <Container className="mainContainer">
            <DocComponent
              metadata={metadata}
              content={content}
              config={this.props.config}
              source={metadata.source}
              hideTitle={this.props.metadata.hide_title}
              title={title}
              version={metadata.version}
              language={metadata.language}
            />
            <div className="docs-prevnext">
              {metadata.previous_id && (
                <a
                  className="docs-prev button"
                  href={this.getRelativeURL(
                    metadata.localized_id,
                    metadata.previous_id
                  )}>
                  ←{' '}
                  {i18n
                    ? translation[this.props.metadata.language][
                        'localized-strings'
                      ][metadata.previous_id] ||
                      translation[this.props.metadata.language][
                        'localized-strings'
                      ]['previous'] ||
                      'Previous'
                    : metadata.previous_title || 'Previous'}
                </a>
              )}
              {metadata.next_id && (
                <a
                  className="docs-next button"
                  href={this.getRelativeURL(
                    metadata.localized_id,
                    metadata.next_id
                  )}>
                  {i18n
                    ? translation[this.props.metadata.language][
                        'localized-strings'
                      ][metadata.next_id] ||
                      translation[this.props.metadata.language][
                        'localized-strings'
                      ]['next'] ||
                      'Next'
                    : metadata.next_title || 'Next'}{' '}
                  →
                </a>
              )}
            </div>
          </Container>
          {this.props.config.onPageNav == 'separate' && (
            <nav className="onPageNav">
              <OnPageNav rawContent={this.props.children} />
            </nav>
          )}
        </div>
      </Site>
    );
  }
}
module.exports = DocsLayout;
