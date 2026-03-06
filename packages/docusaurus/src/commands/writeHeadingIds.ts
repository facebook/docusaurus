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
  type HeadingIdSyntax,
} from '@docusaurus/utils';
import {loadContext} from '../server/site';
import {initPlugins} from '../server/plugins/init';

function inferFallbackSyntax(_filepath: string): HeadingIdSyntax {
  // TODO Docusaurus v4 - infer the syntax based on the file extensions?
  // This is not ideal because we have many ways to define the syntax
  // (front matter "format", siteConfig.markdown.format etc...)
  // but probably good enough for now

  // Until then, we default to the classic syntax
  // The mdx-comment syntax is opt-in
  return 'classic';
}

function getHeadingIdSyntax(filepath: string, options?: WriteHeadingIDOptions) {
  return options?.syntax ?? inferFallbackSyntax(filepath);
}

async function transformMarkdownFile(
  filepath: string,
  options?: WriteHeadingIDOptions,
): Promise<string | undefined> {
  const content = await fs.readFile(filepath, 'utf8');

  const syntax = getHeadingIdSyntax(filepath, options);
  const updatedContent = writeMarkdownHeadingId(content, {
    ...options,
    syntax,
  });
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

// TODO Docusaurus v4 - Upgrade commander, use choices() API?
function validateOptions(options: WriteHeadingIDOptions) {
  const validSyntaxValues: HeadingIdSyntax[] = ['classic', 'mdx-comment'];
  if (options.syntax && !validSyntaxValues.includes(options.syntax)) {
    throw new Error(
      `Invalid --syntax value "${
        options.syntax
      }". Valid values: ${validSyntaxValues.join(', ')}`,
    );
  }
  if (options.overwrite && options.migrate) {
    throw new Error(
      "Options --overwrite and --migrate cannot be used together.\nThe --overwrite already re-generates IDs in the target syntax, so the --migrate option wouldn't have any effect.",
    );
  }
}

export async function writeHeadingIds(
  siteDirParam: string = '.',
  files: string[] = [],
  options: WriteHeadingIDOptions = {},
): Promise<void> {
  validateOptions(options);

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
    } Markdown files already have explicit heading IDs.
If you intend to overwrite the existing heading IDs, use the code=${'--overwrite'} option.
If you intend to change their heading ID syntax, use the code=${'--migrate'} option.`;
  }
}
