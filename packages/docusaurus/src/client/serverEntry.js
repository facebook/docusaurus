/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as eta from 'eta';
import React from 'react';
import {StaticRouter} from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import {Helmet} from 'react-helmet';
import {getBundles} from 'react-loadable-ssr-addon';
import Loadable from 'react-loadable';

import {minify} from 'html-minifier-terser';
import path from 'path';
import fs from 'fs-extra';
import routes from '@generated/routes';
import packageJson from '../../package.json';
// eslint-disable-next-line import/no-unresolved
import preload from './preload';
// eslint-disable-next-line import/no-unresolved
import App from './App';
import {
  createStatefulLinksCollector,
  ProvideLinksCollector,
} from './LinksCollector';
import chalk from 'chalk';
// eslint-disable-next-line no-restricted-imports
import {memoize} from 'lodash';

const getCompiledSSRTemplate = memoize((template) => {
  return eta.compile(template.trim(), {
    rmWhitespace: true,
  });
});

function renderSSRTemplate(ssrTemplate, data) {
  const compiled = getCompiledSSRTemplate(ssrTemplate);
  return compiled(data, eta.defaultConfig);
}

export default async function render(locals) {
  try {
    return await doRender(locals);
  } catch (e) {
    console.error(
      chalk.red(
        `Docusaurus Node/SSR could not render static page with path=${locals.path} because of error: ${e.message}`,
      ),
    );
    throw e;
  }
}

// Renderer for static-site-generator-webpack-plugin (async rendering via promises).
async function doRender(locals) {
  const {
    routesLocation,
    headTags,
    preBodyTags,
    postBodyTags,
    onLinksCollected,
    baseUrl,
    ssrTemplate,
    noIndex,
  } = locals;
  const location = routesLocation[locals.path];
  await preload(routes, location);
  const modules = new Set();
  const context = {};

  const linksCollector = createStatefulLinksCollector();
  const appHtml = ReactDOMServer.renderToString(
    <Loadable.Capture report={(moduleName) => modules.add(moduleName)}>
      <StaticRouter location={location} context={context}>
        <ProvideLinksCollector linksCollector={linksCollector}>
          <App />
        </ProvideLinksCollector>
      </StaticRouter>
    </Loadable.Capture>,
  );
  onLinksCollected(location, linksCollector.getCollectedLinks());

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

  // Get all required assets for this particular page based on client
  // manifest information.
  const modulesToBeLoaded = [...manifest.entrypoints, ...Array.from(modules)];
  const bundles = getBundles(manifest, modulesToBeLoaded);
  const stylesheets = (bundles.css || []).map((b) => b.file);
  const scripts = (bundles.js || []).map((b) => b.file);

  const renderedHtml = renderSSRTemplate(ssrTemplate, {
    appHtml,
    baseUrl,
    htmlAttributes: htmlAttributes || '',
    bodyAttributes: bodyAttributes || '',
    headTags,
    preBodyTags,
    postBodyTags,
    metaAttributes,
    scripts,
    stylesheets,
    noIndex,
    version: packageJson.version,
  });

  // Minify html with https://github.com/DanielRuf/html-minifier-terser
  function doMinify() {
    return minify(renderedHtml, {
      removeComments: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyJS: true,
    });
  }

  // TODO this is a temporary error affecting only monorepos due to Terser 5 (async) being used by html-minifier-terser,
  // instead of the expected Terser 4 (sync)
  // TODO, remove this once we upgrade everything to Terser 5 (https://github.com/terser/html-minifier-terser/issues/46)
  // See also
  // - https://github.com/facebook/docusaurus/issues/3515
  // - https://github.com/terser/html-minifier-terser/issues/49
  try {
    return doMinify();
  } catch (e) {
    if (
      e.message &&
      e.message.includes("Cannot read property 'replace' of undefined")
    ) {
      console.error(
        chalk.red(
          '\nDocusaurus user: you probably have this known error due to using a monorepo/workspace.\nWe have a workaround for you, check https://github.com/facebook/docusaurus/issues/3515\n',
        ),
      );
    }
    throw e;
  }
}
