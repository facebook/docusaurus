/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';

import {
  parseMarkdownHeadingId,
  createSlugger,
  type Slugger,
} from '@docusaurus/utils';
import {safeGlobby} from '../server/utils';

type Options = {
  maintainCase?: boolean;
  overwrite?: boolean;
};

function unwrapMarkdownLinks(line: string): string {
  return line.replace(/\[(?<alt>[^\]]+)\]\([^)]+\)/g, (match, p1) => p1);
}

function addHeadingId(
  line: string,
  slugger: Slugger,
  maintainCase: boolean,
): string {
  let headingLevel = 0;
  while (line.charAt(headingLevel) === '#') {
    headingLevel += 1;
  }

  const headingText = line.slice(headingLevel).trimEnd();
  const headingHashes = line.slice(0, headingLevel);
  const slug = slugger.slug(unwrapMarkdownLinks(headingText).trim(), {
    maintainCase,
  });

  return `${headingHashes}${headingText} {#${slug}}`;
}

export function transformMarkdownContent(
  content: string,
  options: Options = {maintainCase: false, overwrite: false},
): string {
  const {maintainCase = false, overwrite = false} = options;
  const lines = content.split('\n');
  const slugger = createSlugger();

  // If we can't overwrite existing slugs, make sure other headings don't
  // generate colliding slugs by first marking these slugs as occupied
  if (!overwrite) {
    lines.forEach((line) => {
      const parsedHeading = parseMarkdownHeadingId(line);
      if (parsedHeading.id) {
        slugger.slug(parsedHeading.id);
      }
    });
  }

  let inCode = false;
  return lines
    .map((line) => {
      if (line.startsWith('```')) {
        inCode = !inCode;
        return line;
      }
      // Ignore h1 headings, as we don't create anchor links for those
      if (inCode || !line.startsWith('##')) {
        return line;
      }
      const parsedHeading = parseMarkdownHeadingId(line);

      // Do not process if id is already there
      if (parsedHeading.id && !overwrite) {
        return line;
      }
      return addHeadingId(parsedHeading.text, slugger, maintainCase);
    })
    .join('\n');
}

async function transformMarkdownFile(
  filepath: string,
  options?: Options,
): Promise<string | undefined> {
  const content = await fs.readFile(filepath, 'utf8');
  const updatedContent = transformMarkdownContent(content, options);
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
  const context = await loadContext(siteDir);
  const pluginConfigs = await loadPluginConfigs(context);
  const plugins = await initPlugins({
    pluginConfigs,
    context,
  });
  return plugins.flatMap((plugin) => plugin?.getPathsToWatch?.() ?? []);
}

export default async function writeHeadingIds(
  siteDir: string,
  files?: string[],
  options?: Options,
): Promise<void> {
  const markdownFiles = await safeGlobby(
    files ?? (await getPathsToWatch(siteDir)),
    {
      expandDirectories: ['**/*.{md,mdx}'],
    },
  );

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
