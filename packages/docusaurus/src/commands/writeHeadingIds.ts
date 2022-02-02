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
  const slug = slugger
    .slug(unwrapMarkdownLinks(headingText).trim(), {maintainCase})
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  return `${headingHashes}${headingText} {#${slug}}`;
}

export function transformMarkdownHeadingLine(
  line: string,
  slugger: Slugger,
  options: Options = {maintainCase: false, overwrite: false},
): string {
  const {maintainCase = false, overwrite = false} = options;
  if (!line.startsWith('#')) {
    throw new Error(`Line is not a Markdown heading: ${line}.`);
  }

  const parsedHeading = parseMarkdownHeadingId(line);

  // Do not process if id is already there
  if (parsedHeading.id && !overwrite) {
    return line;
  }
  return addHeadingId(parsedHeading.text, slugger, maintainCase);
}

function transformMarkdownLine(
  line: string,
  slugger: Slugger,
  options?: Options,
): string {
  // Ignore h1 headings on purpose, as we don't create anchor links for those
  if (line.startsWith('##')) {
    return transformMarkdownHeadingLine(line, slugger, options);
  }
  return line;
}

function transformMarkdownLines(lines: string[], options?: Options): string[] {
  let inCode = false;
  const slugger = createSlugger();

  return lines.map((line) => {
    if (line.startsWith('```')) {
      inCode = !inCode;
      return line;
    }
    if (inCode) {
      return line;
    }
    return transformMarkdownLine(line, slugger, options);
  });
}

export function transformMarkdownContent(
  content: string,
  options?: Options,
): string {
  return transformMarkdownLines(content.split('\n'), options).join('\n');
}

async function transformMarkdownFile(
  filepath: string,
  options?: Options,
): Promise<string | undefined> {
  const content = await fs.readFile(filepath, 'utf8');
  const updatedContent = transformMarkdownLines(
    content.split('\n'),
    options,
  ).join('\n');
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
