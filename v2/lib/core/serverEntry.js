/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {StaticRouter} from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import {getBundles} from 'react-loadable/webpack';
import Loadable from 'react-loadable';

import reactLoadableStats from '@build/react-loadable.json'; //eslint-disable-line
import webpackClientStats from '@build/client.stats.json'; //eslint-disable-line
import routes from '@generated/routes'; // eslint-disable-line
import preload from './preload';
import App from './App';

// Renderer for static-site-generator-webpack-plugin (async rendering via promises)
export default function render(locals) {
  return preload(routes, locals.path).then(() => {
    const modules = [];
    const context = {};
    const appHtml = ReactDOMServer.renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter location={locals.path} context={context}>
          <App />
        </StaticRouter>
      </Loadable.Capture>,
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

    const bundles = getBundles(reactLoadableStats, modules);
    const assets = [
      ...webpackClientStats.assetsByChunkName.main,
      ...bundles.map(b => b.file),
    ];
    const jsFiles = assets.filter(value => value.match(/\.js$/));
    const cssFiles = assets.filter(value => value.match(/\.css$/));
    const {baseUrl} = locals;

    return `<!DOCTYPE html>
  <html${htmlAttributes ? ` ${htmlAttributes}` : ''}>
    <head>
      ${metaHtml}
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${cssFiles
        .map(
          cssFile =>
            `<link rel="stylesheet" type="text/css" href="${baseUrl}${cssFile}" />`,
        )
        .join('\n')}
    </head>
    <body${bodyAttributes ? ` ${bodyAttributes}` : ''}>
      <div id="app">${appHtml}</div>
      ${jsFiles
        .map(
          jsFile =>
            `<script type="text/javascript" src="${baseUrl}${jsFile}"></script>`,
        )
        .join('\n')}
    </body>
  </html>
`;
  });
}
