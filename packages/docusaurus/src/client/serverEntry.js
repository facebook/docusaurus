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
import {getBundles} from 'react-loadable-ssr-addon-v5-slorber';
import Loadable from 'react-loadable';

import {minify} from 'html-minifier-terser';
import path from 'path';
import fs from 'fs-extra';
import routes from '@generated/routes';
import packageJson from '../../package.json';
import preload from './preload';
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
        `Docusaurus Node/SSR could not render static page with path "${locals.path}" because of following error:\n\n${e.stack}\n`,
      ),
    );

    const isNotDefinedErrorRegex =
      /(window|document|localStorage|navigator|alert|location|buffer|self) is not defined/i;

    if (isNotDefinedErrorRegex.test(e.message)) {
      console.error(
        chalk.green(
          'Pro tip: It looks like you are using code that should run on the client-side only.\nTo get around it, try using <BrowserOnly> (https://docusaurus.io/docs/docusaurus-core/#browseronly) or ExecutionEnvironment (https://docusaurus.io/docs/docusaurus-core/#executionenvironment).\nIt might also require to wrap your client code in useEffect hook and/or import a third-party library dynamically (if any).',
        ),
      );
    }

    throw new Error('Server-side rendering fails due to the error above.');
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
    helmet.script.toString(),
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

  try {
    // Minify html with https://github.com/DanielRuf/html-minifier-terser
    return await minify(renderedHtml, {
      removeComments: false,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyJS: true,
    });
  } catch (e) {
    console.error(
      chalk.red(
        `Minification page with path "${locals.path}" failed because of following error:\n\n${e.stack}\n`,
      ),
    );
    throw e;
  }
}
