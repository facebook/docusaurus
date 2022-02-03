/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import shell from 'shelljs';
import logger from '@docusaurus/logger';
import path from 'path';

type FileLastUpdateData = {timestamp?: number; author?: string};

const GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX = /^(?<timestamp>\d+),(?<author>.+)$/;

let showedGitRequirementError = false;

export async function getFileLastUpdate(
  filePath?: string,
): Promise<FileLastUpdateData | null> {
  if (!filePath) {
    return null;
  }
  function getTimestampAndAuthor(str: string): FileLastUpdateData | null {
    if (!str) {
      return null;
    }

    const temp = str.match(GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX)?.groups;
    return temp
      ? {timestamp: Number(temp.timestamp), author: temp.author}
      : null;
  }

  // Wrap in try/catch in case the shell commands fail
  // (e.g. project doesn't use Git, etc).
  try {
    if (!shell.which('git')) {
      if (!showedGitRequirementError) {
        showedGitRequirementError = true;
        logger.warn('Sorry, the docs plugin last update options require Git.');
      }

      return null;
    }

    if (!shell.test('-f', filePath)) {
      throw new Error(
        `Retrieval of git history failed at "${filePath}" because the file does not exist.`,
      );
    }

    const fileBasename = path.basename(filePath);
    const fileDirname = path.dirname(filePath);
    const result = shell.exec(
      `git log --max-count=1 --format=%ct,%an -- "${fileBasename}"`,
      {
        cwd: fileDirname, // this is needed: https://github.com/facebook/docusaurus/pull/5048
        silent: true,
      },
    );
    if (result.code !== 0) {
      throw new Error(
        `Retrieval of git history failed at "${filePath}" with exit code ${result.code}: ${result.stderr}`,
      );
    }
    return getTimestampAndAuthor(result.stdout.trim());
  } catch (e) {
    logger.error(e);
  }

  return null;
}
