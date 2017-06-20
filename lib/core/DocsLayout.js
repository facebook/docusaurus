const React = require('react');
const Container = require('./Container.js');
const Doc = require('./Doc.js');
const DocsSidebar = require('./DocsSidebar.js');
const Site = require('./Site.js');

class DocsLayout extends React.Component {
  render() {
    const metadata = this.props.metadata;
    const content = this.props.children;
    return (
      <Site
        config={this.props.config}
        className="sideNavVisible"
        section="docs"
        title={
          this.props.config[this.props.metadata.language]['localized-strings'][
            this.props.metadata.localized_id
          ]
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
                this.props.config[this.props.metadata.language]['localized-strings'][
                  this.props.metadata.localized_id
                ]
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
                    this.props.config[this.props.metadata.language][
                      'localized-strings'
                    ]['previous']
                  }
                </a>}
              {metadata.next_id &&
                <a
                  className="docs-next button"
                  href={metadata.next_id + '.html#content'}
                >
                  {
                    this.props.config[this.props.metadata.language][
                      'localized-strings'
                    ]['next']
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