/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import evaluate from 'eval';
import pMap from 'p-map';
import webpack from 'webpack';
import type {ServerEntryParams} from '../types';

const pluginName = 'docusaurus-ssg-plugin';

// Not easy to define a reasonable option default
// Will still be better than Infinity
// See also https://github.com/sindresorhus/p-map/issues/24
const DefaultConcurrency = 32;

// not sure how to import this type otherwise...
type Compilation = webpack.Stats['compilation'];

type Options = {
  entry: string;
  params: ServerEntryParams;
  pathnames: string[];
  trailingSlash?: boolean;
  globals: {[key: string]: unknown};
  concurrency?: number;
};

type Renderer = (
  params: ServerEntryParams & {pathname: string},
) => Promise<string>;

/**
 * This plugin is the result of the re-internalizing an external dependency.
 * Initial code comes from:
 * - Original project: https://github.com/markdalgleish/static-site-generator-webpack-plugin
 * - Our 2022-2024: https://github.com/slorber/static-site-generator-webpack-plugin
 *
 * This dependency is not maintained anymore, and keeping code outside
 * Docusaurus only adds friction to modify/simplify/optimize this logic.
 * Note that we'll likely want to decouple this SSG logic from Webpack some day.
 */
export default class SSGPlugin implements webpack.WebpackPluginInstance {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  apply(compiler: webpack.Compiler): void {
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      compilation.hooks.optimizeAssets.tapPromise(pluginName, async () => {
        await handleStaticSiteGeneration({compilation, options: this.options});
      });
    });
  }
}

/**
 * This concurrently loops over all static route paths
 * and generate the html for each page.
 */
async function handleStaticSiteGeneration({
  compilation,
  options,
}: {
  compilation: Compilation;
  options: Options;
}) {
  const renderer = loadServerEntryRenderer({compilation, options});
  return pMap(
    options.pathnames,
    (pathname) =>
      renderPathname({
        pathname,
        renderer,
        options,
        compilation,
      }),
    {concurrency: options.concurrency ?? DefaultConcurrency},
  );
}

/**
 * This evaluates the "serverEntry.tsx" code
 * This code is bundled by webpack as in ".docusaurus/server.bundle.js"
 * @param options
 * @param compilation
 */
function loadServerEntryRenderer({
  compilation,
  options,
}: {
  compilation: Compilation;
  options: Options;
}): Renderer {
  const entrySource = compilation.assets[options.entry]?.source();
  if (!entrySource) {
    throw new Error(`Source file not found: "${options.entry}"`);
  }
  const serverEntry = evaluate(
    entrySource,
    /* filename: */ options.entry,
    /* scope: */ options.globals,
    /* includeGlobals: */ true,
  ) as {default?: Renderer};
  if (!serverEntry?.default || typeof serverEntry.default !== 'function') {
    throw new Error(
      `Export from "${options.entry}" must be a function that returns an HTML string.`,
    );
  }
  return serverEntry.default;
}

async function renderPathname({
  pathname,
  renderer,
  compilation,
  options,
}: {
  pathname: string;
  renderer: Renderer;
  compilation: Compilation;
  options: Options;
}): Promise<void> {
  try {
    const html = await renderer({pathname, ...options.params});
    const filename = pathnameToFilename({
      pathname,
      trailingSlash: options.trailingSlash,
    });
    compilation.emitAsset(filename, new webpack.sources.RawSource(html));
  } catch (errorUnknown) {
    const error = errorUnknown as Error;

    // This is historical error handling code, not sure it's good...
    // See https://github.com/markdalgleish/static-site-generator-webpack-plugin/blob/master/index.js#L107
    // @ts-expect-error: TODO fix types
    compilation.errors.push(error);
  }
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
