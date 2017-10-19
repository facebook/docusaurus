'use strict';

const React = require('react');
const Markdown = require('Remarkable');

const toSlug = require("./toSlug.js");

function anchors(md) {
  md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
    return '<h' + tokens[idx].hLevel + '>' + '<a class="anchor" name="' + toSlug(tokens[idx+1].content) + '"></a>';
  };
  md.renderer.rules.heading_close = function(tokens, idx /*, options, env */) {
    return ' <a class="hash-link" href="#' + toSlug(tokens[idx-1].content) + '">#</a>' + '</h' + tokens[idx].hLevel + '>\n';
  };
}

class Remarkable extends React.Component {

  render() {
    var Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = new Markdown(nextProps.options);
    }
  }

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  }

  renderMarkdown(source) {
    if (!this.md) {
      this.md = new Markdown(this.props.options);
      this.md.use(anchors);
    }

    return this.md.render(source);
  }
}

Remarkable.defaultProps = {
  container: 'div',
  options: {},
};

module.exports = Remarkable;