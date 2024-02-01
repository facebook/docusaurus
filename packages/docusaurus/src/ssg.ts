/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import evaluate from 'eval';
import pMap from 'p-map';

import {DOCUSAURUS_VERSION} from '@docusaurus/utils';
import ssrDefaultTemplate from './webpack/templates/ssr.html.template';
import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import type {Props} from '@docusaurus/types';
import type {ServerEntryParams} from './types';

// Secret way to set SSR plugin concurrency option
// Waiting for feedback before documenting this officially?
const Concurrency = process.env.DOCUSAURUS_SSR_CONCURRENCY
  ? parseInt(process.env.DOCUSAURUS_SSR_CONCURRENCY, 10)
  : // Not easy to define a reasonable option default
    // Will still be better than Infinity
    // See also https://github.com/sindresorhus/p-map/issues/24
    32;

// TODO refactor type
type Options = {
  params: ServerEntryParams;
  pathnames: string[];
  trailingSlash?: boolean;
};

type Renderer = (
  params: ServerEntryParams & {pathname: string},
) => Promise<string>;

async function loadServerEntryRenderer({
  serverBundlePath,
}: {
  serverBundlePath: string;
}): Promise<Renderer> {
  const source = await fs.readFile(serverBundlePath);

  const filename = path.basename(serverBundlePath);

  // When using "new URL('file.js', import.meta.url)", Webpack will emit
  // __filename, and this plugin will throw. not sure the __filename value
  // has any importance for this plugin, just using an empty string to
  // avoid the error. See https://github.com/facebook/docusaurus/issues/4922
  const globals = {__filename: ''};

  const serverEntry = evaluate(
    source,
    /* filename: */ filename,
    /* scope: */ globals,
    /* includeGlobals: */ true,
  ) as {default?: Renderer};
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
  serverBundlePath,
  options,
}: {
  serverBundlePath: string;
  options: Options;
}): Promise<void> {
  const renderer = await loadServerEntryRenderer({
    serverBundlePath,
  });

  // Note that we implement a fai
  const results = await pMap(
    options.pathnames,
    async (pathname) =>
      generateStaticFile({
        pathname,
        renderer,
        options,
      }).then(
        (result) => ({pathname, result, error: null}),
        (error) => ({pathname, result: null, error: error as Error}),
      ),
    {concurrency: Concurrency},
  );

  const allErrors = results.flatMap((result) =>
    result.error ? {pathname: result.pathname, error: result.error} : [],
  );

  if (allErrors.length > 0) {
    // TODO AggregateError does not log properly with Error.cause :/
    // see also https://github.com/nodejs/node/issues/51637
    // throw new AggregateError(allErrors);

    // Workaround: log errors individually + emit an aggregated error message
    allErrors.forEach((e) => {
      console.error(e.error);
    });
    const message = `Docusaurus static site generation failed for ${
      allErrors.length
    } path${allErrors.length ? 's' : ''}:\n- ${allErrors
      .map((e) => e.pathname)
      .join('\n- ')}`;
    throw new Error(message);
  }
}

async function generateStaticFile({
  pathname,
  renderer,
  options,
}: {
  pathname: string;
  renderer: Renderer;
  options: Options;
}) {
  try {
    const html = await renderer({pathname, ...options.params});

    const filename = pathnameToFilename({
      pathname: removeBaseUrl(pathname, options.params.baseUrl),
      trailingSlash: options.trailingSlash,
    });

    // TODO stream write to disk
    const filePath = path.join(options.params.outDir, filename);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, html);
  } catch (errorUnknown) {
    // TODO throw aggregate error?
    throw new Error(`Can't render static file for pathname=${pathname}`, {
      cause: errorUnknown as Error,
    });
  }
}

function removeBaseUrl(pathname: string, baseUrl: string): string {
  return baseUrl === '/'
    ? pathname
    : pathname.replace(new RegExp(`^${baseUrl}`), '/');
}

export function createServerEntryParams(
  params: Pick<
    ServerEntryParams,
    'onLinksCollected' | 'onHeadTagsCollected'
  > & {
    props: Props;
    manifest: Manifest;
  },
): ServerEntryParams {
  const {props, onLinksCollected, onHeadTagsCollected} = params;
  const {
    baseUrl,
    headTags,
    preBodyTags,
    postBodyTags,
    outDir,
    siteConfig: {noIndex, ssrTemplate},
  } = props;

  return {
    outDir,
    baseUrl,
    manifest: params.manifest,
    headTags,
    preBodyTags,
    postBodyTags,
    onLinksCollected,
    onHeadTagsCollected,
    ssrTemplate: ssrTemplate ?? ssrDefaultTemplate,
    noIndex,
    DOCUSAURUS_VERSION,
  };
}
