/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import {createRequire} from 'module';
import path from 'path';
import _ from 'lodash';
import evaluate from 'eval';
import pMap from 'p-map';
import {minify} from 'html-minifier-terser';
import logger from '@docusaurus/logger';
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
  const source = await PerfLogger.async(`Load server bundle`, () =>
    fs.readFile(serverBundlePath),
  );
  PerfLogger.log(
    `Server bundle size = ${(source.length / 1024000).toFixed(3)} MB`,
  );

  const filename = path.basename(serverBundlePath);

  const globals = {
    // When using "new URL('file.js', import.meta.url)", Webpack will emit
    // __filename, and this plugin will throw. not sure the __filename value
    // has any importance for this plugin, just using an empty string to
    // avoid the error. See https://github.com/facebook/docusaurus/issues/4922
    __filename: '',

    // This uses module.createRequire() instead of very old "require-like" lib
    // See also: https://github.com/pierrec/node-eval/issues/33
    require: createRequire(serverBundlePath),
  };

  const serverEntry = await PerfLogger.async(
    `Evaluate server bundle`,
    () =>
      evaluate(
        source,
        /* filename: */ filename,
        /* scope: */ globals,
        /* includeGlobals: */ true,
      ) as {default?: AppRenderer},
  );

  if (!serverEntry?.default || typeof serverEntry.default !== 'function') {
    throw new Error(
      `Server bundle export from "${filename}" must be a function that renders the Docusaurus React app.`,
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
    const message = `Docusaurus static site generation failed for ${
      allSSGErrors.length
    } path${allSSGErrors.length ? 's' : ''}:\n- ${allSSGErrors
      .map((ssgError) => logger.path(ssgError.pathname))
      .join('\n- ')}`;

    // Note logging this error properly require using inspect(error,{depth})
    // See https://github.com/nodejs/node/issues/51637
    throw new Error(message, {
      cause: new AggregateError(allSSGErrors.map((ssgError) => ssgError.error)),
    });
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
    const error = errorUnknown as Error;
    const tips = getSSGErrorTips(error);
    const message = logger.interpolate`Can't render static file for pathname path=${pathname}${
      tips ? `\n\n${tips}` : ''
    }`;
    throw new Error(message, {
      cause: error,
    });
  }
}

function getSSGErrorTips(error: Error): string {
  const parts = [];

  const isNotDefinedErrorRegex =
    /(?:window|document|localStorage|navigator|alert|location|buffer|self) is not defined/i;
  if (isNotDefinedErrorRegex.test(error.message)) {
    parts.push(`It looks like you are using code that should run on the client-side only.
To get around it, try using one of:
- ${logger.code('<BrowserOnly>')} (${logger.url(
      'https://docusaurus.io/docs/docusaurus-core/#browseronly',
    )})
- ${logger.code('ExecutionEnvironment')} (${logger.url(
      'https://docusaurus.io/docs/docusaurus-core/#executionenvironment',
    )}).
It might also require to wrap your client code in ${logger.code(
      'useEffect',
    )} hook and/or import a third-party library dynamically (if any).`);
  }

  return parts.join('\n');
}

export async function generateHashRouterEntrypoint({
  content,
  params,
}: {
  content: string;
  params: SSGParams;
}): Promise<void> {
  await writeStaticFile({
    pathname: '/',
    content,
    params,
  });
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
