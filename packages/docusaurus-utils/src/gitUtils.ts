/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import shell from 'shelljs';

export class GitNotFoundError extends Error {}

export class FileNotTrackedError extends Error {}

export function getFileCommitDate(
  file: string,
  args: {age?: 'oldest' | 'newest'; includeAuthor?: false},
): {
  date: Date;
  timestamp: number;
};
export function getFileCommitDate(
  file: string,
  args: {age?: 'oldest' | 'newest'; includeAuthor: true},
): {
  date: Date;
  timestamp: number;
  author: string;
};
export function getFileCommitDate(
  file: string,
  {
    age = 'oldest',
    includeAuthor = false,
  }: {
    age?: 'oldest' | 'newest';
    includeAuthor?: boolean;
  },
): {
  date: Date;
  timestamp: number;
  author?: string;
} {
  if (!shell.which('git')) {
    throw new GitNotFoundError(
      `Failed to retrieve git history for "${file}" because git is not installed.`,
    );
  }

  if (!shell.test('-f', file)) {
    throw new Error(
      `Failed to retrieve git history for "${file}" because the file does not exist.`,
    );
  }

  let formatArg = '--format=%ct';
  if (includeAuthor) {
    formatArg += ',%an';
  }

  let extraArgs = '--max-count=1';
  if (age === 'oldest') {
    // --follow is necessary to follow file renames
    // --diff-filter=A ensures we only get the commit which (A)dded the file
    extraArgs += ' --follow --diff-filter=A';
  }

  const result = shell.exec(
    `git log ${extraArgs} ${formatArg} -- "${path.basename(file)}"`,
    {
      // cwd is important, see: https://github.com/facebook/docusaurus/pull/5048
      cwd: path.dirname(file),
      silent: true,
    },
  );
  if (result.code !== 0) {
    throw new Error(
      `Failed to retrieve the git history for file "${file}" with exit code ${result.code}: ${result.stderr}`,
    );
  }
  let regex = /^(?<timestamp>\d+)$/;
  if (includeAuthor) {
    regex = /^(?<timestamp>\d+),(?<author>.+)$/;
  }

  const output = result.stdout.trim();

  if (!output) {
    throw new FileNotTrackedError(
      `Failed to retrieve the git history for file "${file}" because the file is not tracked by git.`,
    );
  }

  const match = output.match(regex);

  if (!match) {
    throw new Error(
      `Failed to retrieve the git history for file "${file}" with unexpected output: ${output}`,
    );
  }

  const timestamp = Number(match.groups!.timestamp);
  const date = new Date(timestamp * 1000);

  if (includeAuthor) {
    return {date, timestamp, author: match.groups!.author!};
  }
  return {date, timestamp};
}
