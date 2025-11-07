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
import logger from '@docusaurus/logger';

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

// TODO Docusaurus v4: remove this
//  Exceptions are not made for control flow logic
/** Custom error thrown when git is not found in `PATH`. */
export class GitNotFoundError extends Error {}

// TODO Docusaurus v4: remove this, only kept for retro-compatibility
//  Exceptions are not made for control flow logic
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
  date: Date; // TODO duplicate data, not really useful?
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

  // Do not include GPG signature in the log output
  // See https://github.com/facebook/docusaurus/pull/10022
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

let showedGitRequirementError = false;
let showedFileNotTrackedError = false;

type GitCommitInfo = {timestamp: number; author: string};

async function getGitCommitInfo(
  filePath: string,
  age: 'oldest' | 'newest',
): Promise<GitCommitInfo | null> {
  if (!filePath) {
    return null;
  }
  // Wrap in try/catch in case the shell commands fail
  // (e.g. project doesn't use Git, etc).
  try {
    const result = await getFileCommitDate(filePath, {
      age,
      includeAuthor: true,
    });
    return {timestamp: result.timestamp, author: result.author};
  } catch (err) {
    // TODO legacy perf issue: do not use exceptions for control flow!
    if (err instanceof GitNotFoundError) {
      if (!showedGitRequirementError) {
        logger.warn('Sorry, the last update options require Git.');
        showedGitRequirementError = true;
      }
    } else if (err instanceof FileNotTrackedError) {
      if (!showedFileNotTrackedError) {
        logger.warn(
          'Cannot infer the update date for some files, as they are not tracked by git.',
        );
        showedFileNotTrackedError = true;
      }
    } else {
      throw new Error(
        `An error occurred when trying to get the last update date`,
        {cause: err},
      );
    }
    return null;
  }
}

export async function getGitLastUpdate(
  filePath: string,
): Promise<GitCommitInfo | null> {
  return getGitCommitInfo(filePath, 'newest');
}

export async function getGitCreation(
  filePath: string,
): Promise<GitCommitInfo | null> {
  return getGitCommitInfo(filePath, 'oldest');
}

export async function getGitRepoRoot(cwd: string): Promise<string> {
  const createErrorMessageBase = () => {
    return `Couldn't find the git repository root directory
Failure while running ${logger.code(
      'git rev-parse --show-toplevel',
    )} from cwd=${logger.path(cwd)}`;
  };

  const result = await execa('git', ['rev-parse', '--show-toplevel'], {
    cwd,
  }).catch((error) => {
    // We enter this rejection when cwd is not a dir for example
    throw new Error(
      `${createErrorMessageBase()}
The command executed throws an error: ${error.message}`,
      {cause: error},
    );
  });

  if (result.exitCode !== 0) {
    throw new Error(
      `${createErrorMessageBase()}
The command returned exit code ${logger.code(result.exitCode)}: ${logger.subdue(
        result.stderr,
      )}`,
    );
  }

  return fs.realpath.native(result.stdout.trim());
}

// A Git "superproject" is a Git repository that contains submodules
// See https://git-scm.com/docs/git-rev-parse#Documentation/git-rev-parse.txt---show-superproject-working-tree
// See https://git-scm.com/book/en/v2/Git-Tools-Submodules
export async function getGitSuperProjectRoot(
  cwd: string,
): Promise<string | null> {
  const createErrorMessageBase = () => {
    return `Couldn't find the git superproject root directory
Failure while running ${logger.code(
      'git rev-parse --show-superproject-working-tree',
    )} from cwd=${logger.path(cwd)}`;
  };

  const result = await execa(
    'git',
    ['rev-parse', '--show-superproject-working-tree'],
    {
      cwd,
    },
  ).catch((error) => {
    // We enter this rejection when cwd is not a dir for example
    throw new Error(
      `${createErrorMessageBase()}
The command executed throws an error: ${error.message}`,
      {cause: error},
    );
  });

  if (result.exitCode !== 0) {
    throw new Error(
      `${createErrorMessageBase()}
The command returned exit code ${logger.code(result.exitCode)}: ${logger.subdue(
        result.stderr,
      )}`,
    );
  }

  const output = result.stdout.trim();
  // this command only works when inside submodules
  // otherwise it doesn't return anything when we are inside the main repo
  if (output) {
    return output;
  }
  return getGitRepoRoot(cwd);
}
