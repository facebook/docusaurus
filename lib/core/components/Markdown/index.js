/* eslint-disable */

import React from 'react';
import Markdown from 'remarkable';
import highlight from './highlight';
import anchors from './anchors';

class MarkdownBlock extends React.Component {
  content() {
    if (this.props.source) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: this.renderMarkdown(this.props.source)
          }}
        />
      );
    }
    return React.Children.map(this.props.children, child => {
      if (typeof child === 'string') {
        return (
          <span
            dangerouslySetInnerHTML={{__html: this.renderMarkdown(child)}}
          />
        );
      }
      return child;
    });
  }

  renderMarkdown(source) {
    const alias = {
      js: 'jsx'
    };
    const {siteConfig} = this.props;
    const md = new Markdown({
      langPrefix: 'hljs css language-',
      highlight: highlight,
      html: true,
      linkify: true
    });

    // Register anchors plugin
    md.use(anchors);

    // Allow client sites to register their own plugins
    if (siteConfig.markdownPlugins) {
      siteConfig.markdownPlugins.forEach(plugin => {
        md.use(plugin);
      });
    }

    const html = md.render(source);

    // Ensure fenced code blocks use Highlight.js hljs class
    // https://github.com/jonschlinkert/remarkable/issues/224
    return html.replace(/<pre><code>/g, '<pre><code class="hljs">');
  }

  render() {
    const Container = this.props.container;
    if (!Container) {
      return <div>{this.content()}</div>;
    }
    return <Container>{this.content()}</Container>;
  }
}

MarkdownBlock.defaultProps = {
  container: 'div',
  siteConfig: {}
};

export default MarkdownBlock;
