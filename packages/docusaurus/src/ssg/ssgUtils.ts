/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import type {SSGParams} from './ssgParams';

// Secret way to set SSR plugin concurrency option
// Waiting for feedback before documenting this officially?
export const SSGConcurrency = process.env.DOCUSAURUS_SSR_CONCURRENCY
  ? parseInt(process.env.DOCUSAURUS_SSR_CONCURRENCY, 10)
  : // Not easy to define a reasonable option default
    // Will still be better than Infinity
    // See also https://github.com/sindresorhus/p-map/issues/24
    32;

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

export async function writeStaticFile({
  content,
  pathname,
  params,
}: {
  content: string;
  pathname: string;
  params: SSGParams;
}): Promise<void> {
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
