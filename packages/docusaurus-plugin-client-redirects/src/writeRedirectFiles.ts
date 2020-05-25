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
import {addTrailingSlash, getFilePathForRoutePath} from './utils';

type FileMetadata = RedirectMetadata & {
  fileAbsolutePath: string;
  fileContent: string;
};

function toFileMetadata(
  redirects: RedirectMetadata[],
  pluginContext: PluginContext,
): FileMetadata[] {
  // Perf: avoid rendering the template twice with the exact same "props"
  // We might create multiple redirect pages for the same destination url
  // note: the first fn arg is the cache key!
  const createPageContentMemoized = memoize((toUrl: string) => {
    return createRedirectPageContent({toUrl});
  });

  return redirects.map((redirect) => {
    const fileAbsolutePath = path.join(
      pluginContext.outDir,
      getFilePathForRoutePath(redirect.fromRoutePath),
    );
    const toUrl = addTrailingSlash(
      `${pluginContext.baseUrl}${redirect.toRoutePath}`,
    );
    const fileContent = createPageContentMemoized(toUrl);
    return {
      ...redirect,
      fileAbsolutePath,
      fileContent,
    };
  });
}

export default async function writeRedirectFiles(
  redirects: RedirectMetadata[],
  pluginContext: PluginContext,
) {
  async function writeFile(file: FileMetadata) {
    try {
      await fs.writeFile(file.fileAbsolutePath, file.fileContent);
    } catch (err) {
      throw new Error(`Redirect file creation error: ${err}`);
    }
  }

  const files = toFileMetadata(redirects, pluginContext);
  await Promise.all(files.map(writeFile));
}
