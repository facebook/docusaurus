/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
// eslint-disable-next-line no-restricted-imports
import _ from 'lodash';
import * as eta from 'eta';
import {StaticRouter} from 'react-router-dom';
import {HelmetProvider, type FilledContext} from 'react-helmet-async';
import {getBundles} from 'react-loadable-ssr-addon-v5-slorber';
import Loadable from 'react-loadable';
import {minify} from 'html-minifier-terser';
import {renderStaticApp} from './serverRenderer';
import preload from './preload';
import App from './App';
import {
  createStatefulBrokenLinks,
  BrokenLinksProvider,
} from './BrokenLinksContext';
import type {PageCollectedData, ServerEntryRenderer} from '../types';

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

const doRender: ServerEntryRenderer = async ({pathname, serverEntryParams}) => {
  const {
    headTags,
    preBodyTags,
    postBodyTags,
    baseUrl,
    ssrTemplate,
    noIndex,
    DOCUSAURUS_VERSION,
    manifest,
  } = serverEntryParams;

  await preload(pathname);
  const modules = new Set<string>();
  const routerContext = {};
  const helmetContext = {};

  const statefulBrokenLinks = createStatefulBrokenLinks();

  const app = (
    // @ts-expect-error: we are migrating away from react-loadable anyways
    <Loadable.Capture report={(moduleName) => modules.add(moduleName)}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={pathname} context={routerContext}>
          <BrokenLinksProvider brokenLinks={statefulBrokenLinks}>
            <App />
          </BrokenLinksProvider>
        </StaticRouter>
      </HelmetProvider>
    </Loadable.Capture>
  );

  const appHtml = await renderStaticApp(app);
  const {helmet} = helmetContext as FilledContext;

  const collectedData: PageCollectedData = {
    anchors: statefulBrokenLinks.getCollectedAnchors(),
    links: statefulBrokenLinks.getCollectedLinks(),
    headTags: helmet,
  };

  const htmlAttributes = helmet.htmlAttributes.toString();
  const bodyAttributes = helmet.bodyAttributes.toString();
  const metaStrings = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ];
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

  const minifiedHtml = await minifyHtml(renderedHtml);

  return {html: minifiedHtml, collectedData};
};

const render: ServerEntryRenderer = async (params) => {
  try {
    return await doRender(params);
  } catch (errorUnknown) {
    const error = errorUnknown as Error;
    const message = buildSSRErrorMessage({error, pathname: params.pathname});
    throw new Error(message, {cause: error});
  }
};

export default render;

async function minifyHtml(html: string): Promise<string> {
  try {
    if (process.env.SKIP_HTML_MINIFICATION === 'true') {
      return html;
    }
    // Minify html with https://github.com/DanielRuf/html-minifier-terser
    return await minify(html, {
      removeComments: false,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyJS: true,
    });
  } catch (err) {
    throw new Error('HTML minification failed', {cause: err as Error});
  }
}
