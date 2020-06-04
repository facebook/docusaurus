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
import {
  addTrailingSlash,
  getFilePathForRoutePath,
  removeTrailingSlash,
} from './utils';

export type WriteFilesPluginContext = Pick<PluginContext, 'baseUrl' | 'outDir'>;

export type RedirectFileMetadata = {
  fileAbsolutePath: string;
  fileContent: string;
};

export function toRedirectFilesMetadata(
  redirects: RedirectMetadata[],
  pluginContext: WriteFilesPluginContext,
): RedirectFileMetadata[] {
  // Perf: avoid rendering the template twice with the exact same "props"
  // We might create multiple redirect pages for the same destination url
  // note: the first fn arg is the cache key!
  const createPageContentMemoized = memoize((toUrl: string) => {
    return createRedirectPageContent({toUrl});
  });

  const createFileMetadata = (redirect: RedirectMetadata) => {
    const fileAbsolutePath = path.join(
      pluginContext.outDir,
      getFilePathForRoutePath(redirect.from),
    );
    const toUrl = addTrailingSlash(
      `${removeTrailingSlash(pluginContext.baseUrl)}${path.join(redirect.to)}`,
    );
    const fileContent = createPageContentMemoized(toUrl);
    return {
      ...redirect,
      fileAbsolutePath,
      fileContent,
    };
  };

  return redirects.map(createFileMetadata);
}

export async function writeRedirectFile(file: RedirectFileMetadata) {
  try {
    // User-friendly security to prevent file overrides
    if (await fs.pathExists(file.fileAbsolutePath)) {
      throw new Error(
        'The redirect plugin is not supposed to override existing files',
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
      `Redirect file creation error for path=${file.fileAbsolutePath}: ${err}`,
    );
  }
}

export default async function writeRedirectFiles(
  redirectFiles: RedirectFileMetadata[],
) {
  await Promise.all(redirectFiles.map(writeRedirectFile));
}
