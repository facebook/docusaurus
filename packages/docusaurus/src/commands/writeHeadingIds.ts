/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {
  safeGlobby,
  writeMarkdownHeadingId,
  type WriteHeadingIDOptions,
} from '@docusaurus/utils';
import {loadContext} from '../server/site';
import {initPlugins} from '../server/plugins/init';

async function transformMarkdownFile(
  filepath: string,
  options?: WriteHeadingIDOptions,
): Promise<string | undefined> {
  const content = await fs.readFile(filepath, 'utf8');
  const updatedContent = writeMarkdownHeadingId(content, options);
  if (content !== updatedContent) {
    await fs.writeFile(filepath, updatedContent);
    return filepath;
  }
  return undefined;
}

/**
 * We only handle the "paths to watch" because these are the paths where the
 * markdown files are. Also we don't want to transform the site md docs that do
 * not belong to a content plugin. For example ./README.md should not be
 * transformed
 */
async function getPathsToWatch(siteDir: string): Promise<string[]> {
  const context = await loadContext({siteDir});
  const plugins = await initPlugins(context);
  return plugins.flatMap((plugin) => plugin.getPathsToWatch?.() ?? []);
}

export async function writeHeadingIds(
  siteDirParam: string = '.',
  files: string[] = [],
  options: WriteHeadingIDOptions = {},
): Promise<void> {
  const siteDir = await fs.realpath(siteDirParam);

  const patterns = files.length ? files : await getPathsToWatch(siteDir);

  const markdownFiles = await safeGlobby(patterns, {
    expandDirectories: ['**/*.{md,mdx}'],
  });

  if (markdownFiles.length === 0) {
    logger.warn`No markdown files found in siteDir path=${siteDir} for patterns: ${patterns}`;
    return;
  }

  const result = await Promise.all(
    markdownFiles.map((p) => transformMarkdownFile(p, options)),
  );

  const pathsModified = result.filter(Boolean) as string[];

  if (pathsModified.length) {
    logger.success`Heading ids added to Markdown files (number=${`${pathsModified.length}/${markdownFiles.length}`} files): ${pathsModified}`;
  } else {
    logger.warn`number=${
      markdownFiles.length
    } Markdown files already have explicit heading IDs. If you intend to overwrite the existing heading IDs, use the code=${'--overwrite'} option.`;
  }
}
