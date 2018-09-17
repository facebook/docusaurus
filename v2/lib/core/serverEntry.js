import React from 'react';
import {StaticRouter} from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';

import App from './App';
import prerender from './prerender';
import routes from '@generated/routes'; // eslint-disable-line
import webpackClientStats from '@build/client.stats.json'; //eslint-disable-line

// Renderer for static-site-generator-webpack-plugin (async rendering via promises)
export default function render(locals) {
  return prerender(routes, locals.path).then(() => {
    const context = {};
    const appHtml = ReactDOMServer.renderToString(
      <StaticRouter location={locals.path} context={context}>
        <App />
      </StaticRouter>,
    );

    const helmet = Helmet.renderStatic();
    const htmlAttributes = helmet.htmlAttributes.toString();
    const bodyAttributes = helmet.bodyAttributes.toString();
    const metaStrings = [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
    ];
    const metaHtml = metaStrings.filter(Boolean).join('\n    ');

    const assets = webpackClientStats.assetsByChunkName.main;
    const jsFiles = assets.filter(value => value.match(/\.js$/));
    const cssFiles = assets.filter(value => value.match(/\.css$/));
    const {baseUrl} = locals;

    const html = `
  <!DOCTYPE html>
  <html${htmlAttributes ? ` ${htmlAttributes}` : ''}>
    <head>
      ${metaHtml}
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${cssFiles.map(
        cssFile =>
          `<link rel="stylesheet" type="text/css" href="${baseUrl}${cssFile}" />`,
      )}
    </head>
    <body${bodyAttributes ? ` ${bodyAttributes}` : ''}>
      <div id="app">${appHtml}</div>
      ${jsFiles.map(
        jsFile =>
          `<script type="text/javascript" src="${baseUrl}${jsFile}"></script>`,
      )}
    </body>
  </html>
`;
    return html;
  });
}
