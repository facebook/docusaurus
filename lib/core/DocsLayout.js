/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const React = require('react');
const Container = require('./Container.js');
const Doc = require('./Doc.js');
const DocsSidebar = require('./DocsSidebar.js');
const Site = require('./Site.js');

class DocsLayout extends React.Component {
  render() {
    const metadata = this.props.metadata;
    const content = this.props.children;
    const i18n = this.props.config[this.props.metadata.language];
    return (
      <Site
        config={this.props.config}
        className="sideNavVisible"
        section="docs"
        title={
          i18n ? this.props.config[this.props.metadata.language]['localized-strings'][
            this.props.metadata.localized_id
          ] || this.props.metadata.title : this.props.metadata.title
        }
        description={content.trim().split('\n')[0]}
        language={metadata.language}
      >
        <div className="docMainWrapper wrapper">
          <DocsSidebar metadata={metadata} />
          <Container className="mainContainer">
            <Doc
              content={content}
              config={this.props.config}
              source={metadata.source}
              title={
                i18n ? this.props.config[this.props.metadata.language]['localized-strings'][
                  this.props.metadata.localized_id
                ] || this.props.metadata.title : this.props.metadata.title
              }
              language={metadata.language}
            />
            <div className="docs-prevnext">
              {metadata.previous_id &&
                <a
                  className="docs-prev button"
                  href={metadata.previous_id + '.html#content'}
                >
                  ←
                  {' '}
                  {
                    i18n ? this.props.config[this.props.metadata.language][
                      'localized-strings'
                    ]['previous'] || 'Previous' : 'Previous'
                  }
                </a>}
              {metadata.next_id &&
                <a
                  className="docs-next button"
                  href={metadata.next_id + '.html#content'}
                >
                  {
                    i18n ? this.props.config[this.props.metadata.language][
                      'localized-strings'
                    ]['next'] || 'Next' : 'Next'
                  }
                  {' '}
                  →
                </a>}
            </div>
          </Container>
        </div>
      </Site>
    );
  }
}
module.exports = DocsLayout;
