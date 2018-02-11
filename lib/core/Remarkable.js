'use strict';

const React = require('react');
const renderMarkdown = require('./renderMarkdown.js');

const CWD = process.cwd();

class Remarkable extends React.Component {
  content() {
    if (this.props.source) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(this.props.source),
          }}
        />
      );
    } else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return (
            <span dangerouslySetInnerHTML={{__html: renderMarkdown(child)}} />
          );
        } else {
          return child;
        }
      });
    }
  }

  render() {
    var Container = this.props.container;

    return <Container>{this.content()}</Container>;
  }
}

Remarkable.defaultProps = {
  container: 'div',
};

module.exports = Remarkable;
