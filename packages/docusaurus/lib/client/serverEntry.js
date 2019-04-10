/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ejs from 'ejs';
import React from 'react';
import {StaticRouter} from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import {Helmet} from 'react-helmet';
import {getBundles} from 'react-loadable-ssr-addon';
import Loadable from 'react-loadable';

import manifest from '@build/assets-manifest.json'; //eslint-disable-line
import routes from '@generated/routes'; // eslint-disable-line
import preload from './preload';
import App from './App';
import ssrTemplate from './templates/ssr.html.template';

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
    const metaAttributes = metaStrings.filter(Boolean);

    // Get all required assets for this particular page based on client manifest information
    const modulesToBeLoaded = [...manifest.entrypoints, ...Array.from(modules)];
    const bundles = getBundles(manifest, modulesToBeLoaded);
    const stylesheets = (bundles.css || []).map(b => b.file);
    const scripts = (bundles.js || []).map(b => b.file);
    const {baseUrl} = locals;

    return ejs.render(
      ssrTemplate.trim(),
      {
        appHtml,
        baseUrl,
        htmlAttributes: htmlAttributes || '',
        bodyAttributes: bodyAttributes || '',
        metaAttributes,
        scripts,
        stylesheets,
      },
      {
        rmWhitespace: true,
      },
    );
  });
}
