'use strict';

const React = require('react');
const hljs = require('highlight.js')
const Markdown = require('remarkable');
const toSlug = require("./toSlug.js");

const CWD = process.cwd();

/**
 * The anchors plugin adds GFM-style anchors to headings.
 */
function anchors(md) {
  md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
    const textToken = tokens[idx+1];
    return '<h' + tokens[idx].hLevel + '><a class="anchor" aria-hidden="true" name="' + toSlug(textToken.content) + '"></a><a href="#' + toSlug(textToken.content) + '" aria-hidden="true" class="hash-link" ><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>';
  };
}

class Remarkable extends React.Component {
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
      const siteConfig = require(CWD + "/siteConfig.js");

      this.md = new Markdown({
        // Highlight.js expects hljs css classes on the code element.
        // This results in <pre><code class="hljs css javascript">
        langPrefix: 'hljs css ',
        highlight: function (str, lang) {
          lang = lang || (siteConfig.highlight && siteConfig.highlight.defaultLang);
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (err) {}
          }

          try {
            return hljs.highlightAuto(str).value;
          } catch (err) {}

          return '';
        },
        html: true,
        linkify: true,
      });

      // Register anchors plugin
      this.md.use(anchors);

      // Allow client sites to register their own plugins
      if (siteConfig.markdownPlugins) {
        siteConfig.markdownPlugins.forEach(function(plugin) {
          this.md.use(plugin);
        }, this);
      }

    }
    const html = this.md.render(source);

    // Ensure fenced code blocks use Highlight.js hljs class
    // https://github.com/jonschlinkert/remarkable/issues/224
    return html.replace(/<pre><code>/g,'<pre><code class="hljs">');
  }

  render() {
    var Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    );
  }
}

Remarkable.defaultProps = {
  container: 'div',
};

module.exports = Remarkable;
