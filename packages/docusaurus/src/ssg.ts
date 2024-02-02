/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import evaluate from 'eval';
import pMap from 'p-map';
import {minify} from 'html-minifier-terser';
import {PerfLogger} from './utils';
import {renderSSRTemplate} from './templates/templates';
import type {AppRenderer, AppRenderResult, SiteCollectedData} from './common';

import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import type {SSRTemplateCompiled} from './templates/templates';

export type SSGParams = {
  trailingSlash: boolean | undefined;
  manifest: Manifest;
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  outDir: string;
  baseUrl: string;
  noIndex: boolean;
  DOCUSAURUS_VERSION: string;
  ssrTemplate: SSRTemplateCompiled;
};

// Secret way to set SSR plugin concurrency option
// Waiting for feedback before documenting this officially?
const Concurrency = process.env.DOCUSAURUS_SSR_CONCURRENCY
  ? parseInt(process.env.DOCUSAURUS_SSR_CONCURRENCY, 10)
  : // Not easy to define a reasonable option default
    // Will still be better than Infinity
    // See also https://github.com/sindresorhus/p-map/issues/24
    32;

export async function loadAppRenderer({
  serverBundlePath,
}: {
  serverBundlePath: string;
}): Promise<AppRenderer> {
  PerfLogger.start(`SSG - Load server bundle`);
  const source = await fs.readFile(serverBundlePath);
  PerfLogger.end(`SSG - Load server bundle`);
  PerfLogger.log(
    `SSG - Server bundle size = ${(source.length / 1024000).toFixed(3)} MB`,
  );

  const filename = path.basename(serverBundlePath);

  // When using "new URL('file.js', import.meta.url)", Webpack will emit
  // __filename, and this plugin will throw. not sure the __filename value
  // has any importance for this plugin, just using an empty string to
  // avoid the error. See https://github.com/facebook/docusaurus/issues/4922
  const globals = {__filename: ''};

  PerfLogger.start(`SSG - Evaluate server bundle`);
  const serverEntry = evaluate(
    source,
    /* filename: */ filename,
    /* scope: */ globals,
    /* includeGlobals: */ true,
  ) as {default?: AppRenderer};
  PerfLogger.end(`SSG - Evaluate server bundle`);

  if (!serverEntry?.default || typeof serverEntry.default !== 'function') {
    throw new Error(
      `Server bundle export from "${filename}" must be a function that returns an HTML string.`,
    );
  }
  return serverEntry.default;
}

function pathnameToFilename({
  pathname,
  trailingSlash,
}: {
  pathname: string;
  trailingSlash?: boolean;
}): string {
  const outputFileName = pathname.replace(/^[/\\]/, ''); // Remove leading slashes for webpack-dev-server
  // Paths ending with .html are left untouched
  if (/\.html?$/i.test(outputFileName)) {
    return outputFileName;
  }
  // Legacy retro-compatible behavior
  if (typeof trailingSlash === 'undefined') {
    return path.join(outputFileName, 'index.html');
  }
  // New behavior: we can say if we prefer file/folder output
  // Useful resource: https://github.com/slorber/trailing-slash-guide
  if (pathname === '' || pathname.endsWith('/') || trailingSlash) {
    return path.join(outputFileName, 'index.html');
  }
  return `${outputFileName}.html`;
}

export async function generateStaticFiles({
  pathnames,
  renderer,
  params,
}: {
  pathnames: string[];
  renderer: AppRenderer;
  params: SSGParams;
}): Promise<{collectedData: SiteCollectedData}> {
  type SSGSuccess = {pathname: string; error: null; result: AppRenderResult};
  type SSGError = {pathname: string; error: Error; result: null};
  type SSGResult = SSGSuccess | SSGError;

  // Note that we catch all async errors on purpose
  // Docusaurus presents all the SSG errors to the user, not just the first one
  const results: SSGResult[] = await pMap(
    pathnames,
    async (pathname) =>
      generateStaticFile({
        pathname,
        renderer,
        params,
      }).then(
        (result) => ({pathname, result, error: null}),
        (error) => ({pathname, result: null, error: error as Error}),
      ),
    {concurrency: Concurrency},
  );

  const [allSSGErrors, allSSGSuccesses] = _.partition(
    results,
    (r): r is SSGError => !!r.error,
  );

  if (allSSGErrors.length > 0) {
    // TODO AggregateError does not log properly with Error.cause :/
    // see also https://github.com/nodejs/node/issues/51637
    // throw new AggregateError(allErrors);

    // Workaround: log errors individually + emit an aggregated error message
    allSSGErrors.forEach((ssgError) => {
      console.error(ssgError.error);
    });
    const message = `Docusaurus static site generation failed for ${
      allSSGErrors.length
    } path${allSSGErrors.length ? 's' : ''}:\n- ${allSSGErrors
      .map((ssgError) => ssgError.pathname)
      .join('\n- ')}`;
    throw new Error(message);
  }

  const collectedData: SiteCollectedData = _.chain(allSSGSuccesses)
    .keyBy((success) => success.pathname)
    .mapValues((ssgSuccess) => ssgSuccess.result.collectedData)
    .value();

  return {collectedData};
}

async function generateStaticFile({
  pathname,
  renderer,
  params,
}: {
  pathname: string;
  renderer: AppRenderer;
  params: SSGParams;
}) {
  try {
    // This only renders the app HTML
    const result = await renderer({
      pathname,
    });
    // This renders the full page HTML, including head tags...
    const fullPageHtml = renderSSRTemplate({
      params,
      result,
    });
    const content = await minifyHtml(fullPageHtml);
    await writeStaticFile({
      pathname,
      content,
      params,
    });
    return result;
  } catch (errorUnknown) {
    throw new Error(`Can't render static file for pathname=${pathname}`, {
      cause: errorUnknown as Error,
    });
  }
}

async function writeStaticFile({
  content,
  pathname,
  params,
}: {
  content: string;
  pathname: string;
  params: SSGParams;
}) {
  function removeBaseUrl(p: string, baseUrl: string): string {
    return baseUrl === '/' ? p : p.replace(new RegExp(`^${baseUrl}`), '/');
  }

  const filename = pathnameToFilename({
    pathname: removeBaseUrl(pathname, params.baseUrl),
    trailingSlash: params.trailingSlash,
  });

  const filePath = path.join(params.outDir, filename);
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content);
}

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
