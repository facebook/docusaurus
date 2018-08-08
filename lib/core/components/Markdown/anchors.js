import toSlug from './toSlug.js';

function anchors(md) {
  const originalRender = md.renderer.rules.heading_open;

  // eslint-disable-next-line
  md.renderer.rules.heading_open = function(tokens, idx, options, env) {
    const textToken = tokens[idx + 1];

    if (textToken.content) {
      const anchor = toSlug(textToken.content, env);

      return `<h${
        tokens[idx].hLevel
      }><a class="anchor" aria-hidden="true" id="${anchor}"></a><a href="#${anchor}" aria-hidden="true" class="hash-link"><svg class="hash-link-icon" aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>`;
    }

    return originalRender(tokens, idx, options, env);
  };
}

module.exports = anchors;
