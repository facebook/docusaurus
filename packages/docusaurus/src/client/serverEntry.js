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

import path from 'path';
import fs from 'fs-extra';
import routes from '@generated/routes';
import preload from './preload';
import App from './App';
import ssrTemplate from './templates/ssr.html.template';

// Renderer for static-site-generator-webpack-plugin (async rendering via promises)
export default async function render(locals) {
  const {routesLocation, headTags, preBodyTags, postBodyTags} = locals;
  const location = routesLocation[locals.path];
  await preload(routes, location);
  const modules = new Set();
  const context = {};
  const appHtml = ReactDOMServer.renderToString(
    <Loadable.Capture report={moduleName => modules.add(moduleName)}>
      <StaticRouter location={location} context={context}>
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

  const {generatedFilesDir} = locals;
  const manifestPath = path.join(generatedFilesDir, 'client-manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

  // chunkName -> chunkAssets mapping.
  const chunkManifestPath = path.join(generatedFilesDir, 'chunk-map.json');
  const chunkManifest = JSON.parse(
    await fs.readFile(chunkManifestPath, 'utf8'),
  );
  const chunkManifestScript =
    `<script type="text/javascript">` +
    `/*<![CDATA[*/window.__chunkMapping=${JSON.stringify(
      chunkManifest,
    )};/*]]>*/` +
    `</script>`;

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
      chunkManifestScript,
      htmlAttributes: htmlAttributes || '',
      bodyAttributes: bodyAttributes || '',
      headTags,
      preBodyTags,
      postBodyTags,
      metaAttributes,
      scripts,
      stylesheets,
    },
    {
      rmWhitespace: true,
    },
  );
}
