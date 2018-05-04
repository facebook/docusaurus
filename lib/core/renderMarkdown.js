/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const hljs = require('highlight.js');
const Markdown = require('remarkable');

const anchors = require('./anchors.js');

const CWD = process.cwd();

class MarkdownRenderer {
  constructor() {
    const siteConfig = require(CWD + '/siteConfig.js');

    const md = new Markdown({
      // Highlight.js expects hljs css classes on the code element.
      // This results in <pre><code class="hljs css javascript">
      langPrefix: 'hljs css ',
      highlight: function(str, lang) {
        lang =
          lang || (siteConfig.highlight && siteConfig.highlight.defaultLang);
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
    md.use(anchors);

    // Allow client sites to register their own plugins
    if (siteConfig.markdownPlugins) {
      siteConfig.markdownPlugins.forEach(function(plugin) {
        md.use(plugin);
      });
    }

    this._md = md;
  }

  toHtml(source) {
    const html = this._md.render(source);

    // Ensure fenced code blocks use Highlight.js hljs class
    // https://github.com/jonschlinkert/remarkable/issues/224
    return html.replace(/<pre><code>/g, '<pre><code class="hljs">');
  }
}

const renderMarkdown = new MarkdownRenderer();

module.exports = source => {
  return renderMarkdown.toHtml(source);
};
