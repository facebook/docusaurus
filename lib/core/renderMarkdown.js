/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const hljs = require('highlight.js');
const Markdown = require('remarkable');
const prismjs = require('prismjs');

const anchors = require('./anchors.js');

const CWD = process.cwd();

const alias = {
  js: 'jsx',
};

class MarkdownRenderer {
  constructor() {
    const siteConfig = require(`${CWD}/siteConfig.js`);

    const md = new Markdown({
      // Highlight.js expects hljs css classes on the code element.
      // This results in <pre><code class="hljs css languages-jsx">
      langPrefix: 'hljs css languages-',
      highlight(str, lang) {
        lang =
          lang || (siteConfig.highlight && siteConfig.highlight.defaultLang);
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

    this.md = md;
  }

  toHtml(source) {
    const html = this.md.render(source);

    // Ensure fenced code blocks use Highlight.js hljs class
    // https://github.com/jonschlinkert/remarkable/issues/224
    return html.replace(/<pre><code>/g, '<pre><code class="hljs">');
  }
}

const renderMarkdown = new MarkdownRenderer();

module.exports = source => renderMarkdown.toHtml(source);
