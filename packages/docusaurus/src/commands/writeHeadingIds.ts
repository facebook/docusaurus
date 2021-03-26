/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import GithubSlugger from 'github-slugger';
import chalk from 'chalk';
import {loadContext, loadPluginConfigs} from '../server';
import initPlugins from '../server/plugins/init';

import {flatten} from 'lodash';
import {parseMarkdownHeadingId} from '@docusaurus/utils';
import {safeGlobby} from '../server/utils';

export function unwrapMarkdownLinks(line: string): string {
  return line.replace(/\[([^\]]+)\]\([^)]+\)/g, (match, p1) => p1);
}

function addHeadingId(line: string, slugger: GithubSlugger): string {
  let headingLevel = 0;
  while (line.charAt(headingLevel) === '#') {
    headingLevel += 1;
  }

  const headingText = line.slice(headingLevel).trimEnd();
  const headingHashes = line.slice(0, headingLevel);
  const slug = slugger.slug(unwrapMarkdownLinks(headingText));

  return `${headingHashes}${headingText} {#${slug}}`;
}

export function transformMarkdownHeadingLine(
  line: string,
  slugger: GithubSlugger,
): string {
  if (!line.startsWith('#')) {
    throw new Error(`Line is not a markdown heading: ${line}`);
  }

  const parsedHeading = parseMarkdownHeadingId(line);

  // Do not process if id is already therer
  if (parsedHeading.id) {
    return line;
  }
  return addHeadingId(line, slugger);
}

export function transformMarkdownLine(
  line: string,
  slugger: GithubSlugger,
): string {
  if (line.startsWith('#')) {
    return transformMarkdownHeadingLine(line, slugger);
  } else {
    return line;
  }
}

function transformMarkdownLines(lines: string[]): string[] {
  let inCode = false;
  const slugger = new GithubSlugger();

  return lines.map((line) => {
    if (line.startsWith('```')) {
      inCode = !inCode;
      return line;
    } else {
      if (inCode) {
        return line;
      }
      return transformMarkdownLine(line, slugger);
    }
  });
}

export function transformMarkdownContent(content: string): string {
  return transformMarkdownLines(content.split('\n')).join('\n');
}

async function transformMarkdownFile(
  filepath: string,
): Promise<string | undefined> {
  const content = await fs.readFile(filepath, 'utf8');
  const updatedContent = transformMarkdownLines(content.split('\n')).join('\n');
  if (content !== updatedContent) {
    await fs.writeFile(filepath, updatedContent);
    return filepath;
  }
  return undefined;
}

// We only handle the "paths to watch" because these are the paths where the markdown files are
// Also we don't want to transform the site md docs that do not belong to a content plugin
// For example ./README.md should not be transformed
async function getPathsToWatch(siteDir: string): Promise<string[]> {
  const context = await loadContext(siteDir);
  const pluginConfigs = loadPluginConfigs(context);
  const plugins = await initPlugins({
    pluginConfigs,
    context,
  });
  return flatten(plugins.map((plugin) => plugin?.getPathsToWatch?.() ?? []));
}

export default async function writeHeadingIds(siteDir: string): Promise<void> {
  const markdownFiles = await safeGlobby(await getPathsToWatch(siteDir), {
    expandDirectories: ['**/*.{md,mdx}'],
  });

  const result = await Promise.all(markdownFiles.map(transformMarkdownFile));

  const pathsModified = result.filter(Boolean) as string[];

  if (pathsModified.length) {
    console.log(
      chalk.green(`Heading ids added to markdown files (${
        pathsModified.length
      }/${markdownFiles.length} files):
- ${pathsModified.join('\n- ')}`),
    );
  } else {
    console.log(
      chalk.yellow(
        `${markdownFiles.length} markdown files already have explicit heading ids`,
      ),
    );
  }
}
