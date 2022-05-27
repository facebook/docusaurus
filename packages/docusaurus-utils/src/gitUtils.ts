/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import shell from 'shelljs';

/** Custom error thrown when git is not found in `PATH`. */
export class GitNotFoundError extends Error {}

/** Custom error thrown when the current file is not tracked by git. */
export class FileNotTrackedError extends Error {}

/**
 * Fetches the git history of a file and returns a relevant commit date.
 * It gets the commit date instead of author date so that amended commits
 * can have their dates updated.
 *
 * @throws {@link GitNotFoundError} If git is not found in `PATH`.
 * @throws {@link FileNotTrackedError} If the current file is not tracked by git.
 * @throws Also throws when `git log` exited with non-zero, or when it outputs
 * unexpected text.
 */
export function getFileCommitDate(
  /** Absolute path to the file. */
  file: string,
  args: {
    /**
     * `"oldest"` is the commit that added the file, following renames;
     * `"newest"` is the last commit that edited the file.
     */
    age?: 'oldest' | 'newest';
    /** Use `includeAuthor: true` to get the author information as well. */
    includeAuthor?: false;
  },
): {
  /** Relevant commit date. */
  date: Date;
  /** Timestamp in **seconds**, as returned from git. */
  timestamp: number;
};
/**
 * Fetches the git history of a file and returns a relevant commit date.
 * It gets the commit date instead of author date so that amended commits
 * can have their dates updated.
 *
 * @throws {@link GitNotFoundError} If git is not found in `PATH`.
 * @throws {@link FileNotTrackedError} If the current file is not tracked by git.
 * @throws Also throws when `git log` exited with non-zero, or when it outputs
 * unexpected text.
 */
export function getFileCommitDate(
  /** Absolute path to the file. */
  file: string,
  args: {
    /**
     * `"oldest"` is the commit that added the file, following renames;
     * `"newest"` is the last commit that edited the file.
     */
    age?: 'oldest' | 'newest';
    includeAuthor: true;
  },
): {
  /** Relevant commit date. */
  date: Date;
  /** Timestamp in **seconds**, as returned from git. */
  timestamp: number;
  /** The author's name, as returned from git. */
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

  const args = [
    `--format=%ct${includeAuthor ? ',%an' : ''}`,
    '--max-count=1',
    age === 'oldest' ? '--follow --diff-filter=A' : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const result = shell.exec(`git log ${args} -- "${path.basename(file)}"`, {
    // Setting cwd is important, see: https://github.com/facebook/docusaurus/pull/5048
    cwd: path.dirname(file),
    silent: true,
  });
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
