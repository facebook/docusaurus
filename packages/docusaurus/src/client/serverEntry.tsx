/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import fs from 'fs-extra';
// eslint-disable-next-line no-restricted-imports
import _ from 'lodash';
import * as eta from 'eta';
import {StaticRouter} from 'react-router-dom';
import {HelmetProvider, type FilledContext} from 'react-helmet-async';
import {getBundles, type Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import Loadable from 'react-loadable';
import {minify} from 'html-minifier-terser';
import {renderStaticApp} from './serverRenderer';
import preload from './preload';
import App from './App';
import {
  createStatefulBrokenLinks,
  BrokenLinksProvider,
} from './BrokenLinksContext';

import type {ServerEntryParams} from '../types';

// Result is cached for performance, this file can be heavy
const readManifestAsync = _.memoize(async (manifestPath: string) => {
  // Using readJSON seems to fail for users of some plugins, possibly because of
  // the eval sandbox having a different `Buffer` instance (native one instead
  // of polyfilled one)
  const content = await fs.readFile(manifestPath, 'utf-8');
  return JSON.parse(content) as Manifest;
});

const getCompiledSSRTemplate = _.memoize((template: string) =>
  eta.compile(template.trim(), {
    rmWhitespace: true,
  }),
);

function renderSSRTemplate(ssrTemplate: string, data: object) {
  const compiled = getCompiledSSRTemplate(ssrTemplate);
  return compiled(data, eta.defaultConfig);
}

function buildSSRErrorMessage({
  error,
  pathname,
}: {
  error: Error;
  pathname: string;
}): string {
  const parts = [
    `Docusaurus server-side rendering could not render static page with path ${pathname} because of error: ${error.message}`,
  ];

  const isNotDefinedErrorRegex =
    /(?:window|document|localStorage|navigator|alert|location|buffer|self) is not defined/i;

  if (isNotDefinedErrorRegex.test(error.message)) {
    // prettier-ignore
    parts.push(`It looks like you are using code that should run on the client-side only.
To get around it, try using \`<BrowserOnly>\` (https://docusaurus.io/docs/docusaurus-core/#browseronly) or \`ExecutionEnvironment\` (https://docusaurus.io/docs/docusaurus-core/#executionenvironment).
It might also require to wrap your client code in \`useEffect\` hook and/or import a third-party library dynamically (if any).`);
  }

  return parts.join('\n');
}

export default async function render(
  params: ServerEntryParams & {pathname: string},
): Promise<string> {
  try {
    return await doRender(params);
  } catch (errorUnknown) {
    const error = errorUnknown as Error;
    const message = buildSSRErrorMessage({error, pathname: params.pathname});
    const ssrError = new Error(message, {cause: error});
    // It is important to log the error here because the stacktrace causal chain
    // is not available anymore upper in the tree (this SSR runs in eval)
    console.error(ssrError);
    throw ssrError;
  }
}

// Renderer for static-site-generator-webpack-plugin (async rendering).
async function doRender(params: ServerEntryParams & {pathname: string}) {
  const {
    headTags,
    preBodyTags,
    postBodyTags,
    onLinksCollected,
    onHeadTagsCollected,
    baseUrl,
    ssrTemplate,
    noIndex,
    DOCUSAURUS_VERSION,
    manifestPath,
  } = params;
  const manifest = await readManifestAsync(manifestPath);

  const location = params.pathname;
  await preload(location);
  const modules = new Set<string>();
  const routerContext = {};
  const helmetContext = {};

  const statefulBrokenLinks = createStatefulBrokenLinks();

  const app = (
    // @ts-expect-error: we are migrating away from react-loadable anyways
    <Loadable.Capture report={(moduleName) => modules.add(moduleName)}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={location} context={routerContext}>
          <BrokenLinksProvider brokenLinks={statefulBrokenLinks}>
            <App />
          </BrokenLinksProvider>
        </StaticRouter>
      </HelmetProvider>
    </Loadable.Capture>
  );

  const appHtml = await renderStaticApp(app);

  onLinksCollected({
    staticPagePath: location,
    anchors: statefulBrokenLinks.getCollectedAnchors(),
    links: statefulBrokenLinks.getCollectedLinks(),
  });

  const {helmet} = helmetContext as FilledContext;
  const htmlAttributes = helmet.htmlAttributes.toString();
  const bodyAttributes = helmet.bodyAttributes.toString();
  const metaStrings = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ];
  onHeadTagsCollected(location, helmet);
  const metaAttributes = metaStrings.filter(Boolean);

  // Get all required assets for this particular page based on client
  // manifest information.
  const modulesToBeLoaded = [...manifest.entrypoints, ...Array.from(modules)];
  const bundles = getBundles(manifest, modulesToBeLoaded);
  const stylesheets = (bundles.css ?? []).map((b) => b.file);
  const scripts = (bundles.js ?? []).map((b) => b.file);

  const renderedHtml = renderSSRTemplate(ssrTemplate, {
    appHtml,
    baseUrl,
    htmlAttributes,
    bodyAttributes,
    headTags,
    preBodyTags,
    postBodyTags,
    metaAttributes,
    scripts,
    stylesheets,
    noIndex,
    version: DOCUSAURUS_VERSION,
  });

  try {
    if (process.env.SKIP_HTML_MINIFICATION === 'true') {
      return renderedHtml;
    }

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
  } catch (err) {
    // prettier-ignore
    console.error(`Minification of page ${params.pathname} failed.`);
    console.error(err);
    throw err;
  }
}
