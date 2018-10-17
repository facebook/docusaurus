/* eslint-disable */

import React from 'react';
import Markdown from 'remarkable';
import Helmet from 'react-helmet';
import hljs from 'highlight.js';
import chalk from 'chalk';
import escapeHtml from 'escape-html';
import anchors from './anchors';

class MarkdownBlock extends React.Component {
  content() {
    if (this.props.source) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: this.renderMarkdown(this.props.source),
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
      js: 'jsx',
    };
    const {siteConfig} = this.props;
    const md = new Markdown({
      langPrefix: 'hljs css language-',
      highlight: function(str, rawLang) {
        // Default language fallback
        const defaultLang =
          siteConfig.highlight && siteConfig.highlight.defaultLang;

        // No syntax highlighting
        if (rawLang === 'text' || (!rawLang && !defaultLang)) {
          return escapeHtml(str);
        }

        // User's own hljs function to register additional languages
        if (siteConfig.highlight && siteConfig.highlight.hljs) {
          siteConfig.highlight.hljs(hljs);
        }

        // Syntax highlighting
        const lang = rawLang.toLowerCase() || defaultLang;
        try {
          if (hljs.getLanguage(lang)) {
            return hljs.highlight(lang, str).value;
          }
        } catch (e) {
          console.error(
            chalk.yellow(
              `Highlight.js syntax highlighting for language "${lang}" is not supported.`,
            ),
          );
        }
        return hljs.highlightAuto(str).value;
      },
      html: true,
      linkify: true,
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
    const {siteConfig} = this.props;
    const highlight = Object.assign(
      {},
      {
        version: '9.12.0',
        theme: 'default',
      },
      siteConfig.highlight,
    );

    // Use user-provided themeUrl if it exists, else construct one from version and theme.
    const highlightThemeURL = highlight.themeUrl
      ? highlight.themeUrl
      : `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${
          highlight.version
        }/styles/${highlight.theme}.min.css`;

    return (
      <div>
        <Helmet>
          <link rel="stylesheet" type="text/css" href={highlightThemeURL} />
        </Helmet>
        {this.content()}
      </div>
    );
  }
}

MarkdownBlock.defaultProps = {
  siteConfig: {},
};

export default MarkdownBlock;
