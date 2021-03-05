/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import globby from 'globby';
import fs from 'fs-extra';
import GithubSlugger from 'github-slugger';

function stripLinks(line) {
  return line.replace(/\[([^\]]+)\]\([^)]+\)/, (match, p1) => p1);
}

function addHeaderId(line, slugger) {
  const headingText = line.slice(line.indexOf(' ')).trim();
  const headingLevel = line.slice(0, line.indexOf(' '));
  return `${headingLevel} ${headingText} {#${slugger.slug(
    stripLinks(headingText),
  )}}`;
}

function addHeadingIds(lines) {
  let inCode = false;
  const results: string[] = [];
  const slugger = new GithubSlugger();

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      inCode = !inCode;
      results.push(line);
      return;
    }

    if (inCode) {
      results.push(line);
      return;
    }

    if (!line.startsWith('#')) {
      results.push(line);
      return;
    }

    if (/\{#[^}]+\}/.test(line)) {
      results.push(line);
      return;
    }

    results.push(addHeaderId(line, slugger));
  });

  return results;
}

export default async function writeHeadingIds(
  contentDir: string,
): Promise<void> {
  const markdownFiles = await globby(contentDir.split(' '), {
    expandDirectories: ['**/*.{md,mdx}'],
  });

  markdownFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    const updatedLines = addHeadingIds(lines);
    fs.writeFileSync(file, updatedLines.join('\n'));
  });
}
