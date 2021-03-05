/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs-extra';
import GithubSlugger from 'github-slugger';
import chalk from 'chalk';

export function stripLinks(line) {
  return line.replace(/\[([^\]]+)\]\([^)]+\)/, (match, p1) => p1);
}

function addHeadingId(line, slugger) {
  let headingLevel = 0;
  while (line.charAt(headingLevel) === '#') {
    headingLevel += 1;
  }

  const headingText = line.slice(headingLevel).trimEnd();
  const headingHashes = line.slice(0, headingLevel);
  const slug = slugger.slug(stripLinks(headingText));

  return `${headingHashes}${headingText} {#${slug}}`;
}

export function transformMarkdownHeadingLine(
  line: string,
  slugger: GithubSlugger,
) {
  if (!line.startsWith('#')) {
    throw new Error(`Line is not a markdown heading: ${line}`);
  }

  const alreadyHasId = /\{#[^}]+\}/.test(line);
  if (alreadyHasId) {
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

export default async function writeHeadingIds(siteDir: string): Promise<void> {
  const markdownFiles = await globby(siteDir, {
    expandDirectories: ['**/*.{md,mdx}'],
  });

  const result = await Promise.all(markdownFiles.map(transformMarkdownFile));

  const pathsModified = result.filter(Boolean) as string[];

  if (pathsModified.length) {
    console.log(
      chalk.green(`Heading ids added to markdown files (${
        pathsModified.length
      } / ${markdownFiles.length}):
- ${pathsModified.join('\n- ')}`),
    );
  } else {
    console.log(
      chalk.yellow(`No heading id had to be added to any markdown file`),
    );
  }
}
