/**
 * Html
 * This Html.js file acts as a template that we insert all our generated
 * application code into before sending it to the client as regular HTML.
 * Note we're returning a template string from this function.
 */

module.exports = function createHtml({title, body, bundlejs, lang}) {
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
      <head>
        <title>${title}</title>
      </head>
      <body>
        <div id="app">${body}</div>
        <script src="${bundlejs}"></script>
      </body>
    </html>
    `;
};
