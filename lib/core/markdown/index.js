import React from 'react';
import Markdown from 'remarkable';
import hljs from 'highlight.js';
import prismjs from 'prismjs';

import anchors from './anchors.js';

class MarkdownBlock extends React.Component {
  renderMarkdown(source) {
    const alias = {
      js: 'jsx'
    };
    const {siteConfig} = this.props;
    const md = new Markdown({
      langPrefix: 'hljs css language-',
      highlight(str, lang) {
        lang =
          lang || (siteConfig.highlight && siteConfig.highlight.defaultLang);
        if (lang === 'text') {
          return str;
        }
        if (lang) {
          try {
            if (
              siteConfig.usePrism === true ||
              (siteConfig.usePrism &&
                siteConfig.usePrism.length > 0 &&
                siteConfig.usePrism.indexOf(lang) !== -1)
            ) {
              try {
                const language = alias[lang] || lang;
                // Currently people using prismjs on Node have to individually require()
                // every single language (https://github.com/PrismJS/prism/issues/593)
                require(`prismjs/components/prism-${language}.min`);
                return prismjs.highlight(str, prismjs.languages[language]);
              } catch (err) {
                console.error(err);
              }
            }
            if (hljs.getLanguage(lang)) {
              return hljs.highlight(lang, str).value;
            }
          } catch (err) {
            console.error(err);
          }
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {
          console.error(err);
        }

        return '';
      },
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

  content() {
    if (this.props.source) {
      return (
        <span
          dangerouslySetInnerHTML={{
            __html: this.renderMarkdown(this.props.source)
          }}
        />
      );
    } else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return (
            <span
              dangerouslySetInnerHTML={{__html: this.renderMarkdown(child)}}
            />
          );
        } else {
          return child;
        }
      });
    }
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
