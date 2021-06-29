/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {memoize} from 'lodash';

import {PluginContext, RedirectMetadata} from './types';
import createRedirectPageContent from './createRedirectPageContent';
import {getFilePathForRoutePath, normalizeUrl} from '@docusaurus/utils';

export type WriteFilesPluginContext = Pick<PluginContext, 'baseUrl' | 'outDir'>;

export type RedirectFileMetadata = {
  fileAbsolutePath: string;
  fileContent: string;
};

export function createToUrl(baseUrl: string, to: string): string {
  return normalizeUrl([baseUrl, to]);
}

function getRedirectFilePathRelative(
  from: string,
  trailingSlash: boolean | undefined,
) {
  const filePath = getFilePathForRoutePath(from, trailingSlash);

  // Special case, when using fromExtensions: ["html"] with trailingSlash: undefined/true
  // If the target path is /xyz, with file /xyz/index.html
  // We don't want the redirect file to be /xyz.html
  // Otherwise it could be picked in priority and the redirect file would redirect to itself
  // This can potentially create an infinite loop (depends on host, like Netlify)
  // We prefer the redirect file to be /xyz.html/index.html, as it has lower priority and is also the historical behavior of this plugin
  // See also https://github.com/facebook/docusaurus/issues/5055#issuecomment-870731207
  if (filePath.endsWith('.html') && !filePath.endsWith('index.html')) {
    return path.join(filePath, 'index.html');
  }

  return filePath;
}

export function toRedirectFilesMetadata(
  redirects: RedirectMetadata[],
  pluginContext: WriteFilesPluginContext,
  trailingSlash: boolean | undefined,
): RedirectFileMetadata[] {
  // Perf: avoid rendering the template twice with the exact same "props"
  // We might create multiple redirect pages for the same destination url
  // note: the first fn arg is the cache key!
  const createPageContentMemoized = memoize((toUrl: string) => {
    return createRedirectPageContent({toUrl});
  });

  const createFileMetadata = (redirect: RedirectMetadata) => {
    const fileRelativePath = getRedirectFilePathRelative(
      redirect.from,
      trailingSlash,
    );
    const fileAbsolutePath = path.join(pluginContext.outDir, fileRelativePath);
    const toUrl = createToUrl(pluginContext.baseUrl, redirect.to);
    const fileContent = createPageContentMemoized(toUrl);
    return {
      ...redirect,
      fileAbsolutePath,
      fileContent,
    };
  };

  return redirects.map(createFileMetadata);
}

export async function writeRedirectFile(
  file: RedirectFileMetadata,
): Promise<void> {
  try {
    // User-friendly security to prevent file overrides
    if (await fs.pathExists(file.fileAbsolutePath)) {
      throw new Error(
        'The redirect plugin is not supposed to override existing files.',
      );
    }
    await fs.ensureDir(path.dirname(file.fileAbsolutePath));
    await fs.writeFile(
      file.fileAbsolutePath,
      file.fileContent,
      // Hard security to prevent file overrides
      // See https://stackoverflow.com/a/34187712/82609
      {flag: 'wx'},
    );
  } catch (err) {
    throw new Error(
      `Redirect file creation error for "${file.fileAbsolutePath}" path: ${err}.`,
    );
  }
}

export default async function writeRedirectFiles(
  redirectFiles: RedirectFileMetadata[],
): Promise<void> {
  await Promise.all(redirectFiles.map(writeRedirectFile));
}
