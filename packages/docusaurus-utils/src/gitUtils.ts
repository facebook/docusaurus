/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import _ from 'lodash';
import execa from 'execa';
import PQueue from 'p-queue';

// Quite high/conservative concurrency value (it was previously "Infinity")
// See https://github.com/facebook/docusaurus/pull/10915
const DefaultGitCommandConcurrency =
  // TODO Docusaurus v4: bump node, availableParallelism() now always exists
  (typeof os.availableParallelism === 'function'
    ? os.availableParallelism()
    : os.cpus().length) * 4;

const GitCommandConcurrencyEnv = process.env.DOCUSAURUS_GIT_COMMAND_CONCURRENCY
  ? parseInt(process.env.DOCUSAURUS_GIT_COMMAND_CONCURRENCY, 10)
  : undefined;

const GitCommandConcurrency =
  GitCommandConcurrencyEnv && GitCommandConcurrencyEnv > 0
    ? GitCommandConcurrencyEnv
    : DefaultGitCommandConcurrency;

// We use a queue to avoid running too many concurrent Git commands at once
// See https://github.com/facebook/docusaurus/issues/10348
const GitCommandQueue = new PQueue({
  concurrency: GitCommandConcurrency,
});

const realHasGitFn = () => {
  try {
    return execa.sync('git', ['--version']).exitCode === 0;
  } catch (error) {
    return false;
  }
};

// The hasGit call is synchronous IO so we memoize it
// The user won't install Git in the middle of a build anyway...
const hasGit =
  process.env.NODE_ENV === 'test' ? realHasGitFn : _.memoize(realHasGitFn);

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
export async function getFileCommitDate(
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
): Promise<{
  /** Relevant commit date. */
  date: Date;
  /** Timestamp returned from git, converted to **milliseconds**. */
  timestamp: number;
}>;
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
export async function getFileCommitDate(
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
): Promise<{
  /** Relevant commit date. */
  date: Date;
  /** Timestamp returned from git, converted to **milliseconds**. */
  timestamp: number;
  /** The author's name, as returned from git. */
  author: string;
}>;

export async function getFileCommitDate(
  file: string,
  {
    age = 'oldest',
    includeAuthor = false,
  }: {
    age?: 'oldest' | 'newest';
    includeAuthor?: boolean;
  },
): Promise<{
  date: Date;
  timestamp: number;
  author?: string;
}> {
  if (!hasGit()) {
    throw new GitNotFoundError(
      `Failed to retrieve git history for "${file}" because git is not installed.`,
    );
  }

  if (!(await fs.pathExists(file))) {
    throw new Error(
      `Failed to retrieve git history for "${file}" because the file does not exist.`,
    );
  }

  // We add a "RESULT:" prefix to make parsing easier
  // See why: https://github.com/facebook/docusaurus/pull/10022
  const resultFormat = includeAuthor ? 'RESULT:%ct,%an' : 'RESULT:%ct';

  const args = [
    `--format=${resultFormat}`,
    '--max-count=1',
    age === 'oldest' ? '--follow --diff-filter=A' : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const command = `git -c log.showSignature=false log ${args} -- "${path.basename(
    file,
  )}"`;

  const result = (await GitCommandQueue.add(() => {
    return execa(command, {
      cwd: path.dirname(file),
      shell: true,
    });
  }))!;

  if (result.exitCode !== 0) {
    throw new Error(
      `Failed to retrieve the git history for file "${file}" with exit code ${result.exitCode}: ${result.stderr}`,
    );
  }

  // We only parse the output line starting with our "RESULT:" prefix
  // See why https://github.com/facebook/docusaurus/pull/10022
  const regex = includeAuthor
    ? /(?:^|\n)RESULT:(?<timestamp>\d+),(?<author>.+)(?:$|\n)/
    : /(?:^|\n)RESULT:(?<timestamp>\d+)(?:$|\n)/;

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

  const timestampInSeconds = Number(match.groups!.timestamp);
  const timestamp = timestampInSeconds * 1_000;
  const date = new Date(timestamp);

  if (includeAuthor) {
    return {date, timestamp, author: match.groups!.author!};
  }
  return {date, timestamp};
}
