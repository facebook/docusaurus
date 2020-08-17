/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import shell from 'shelljs';
import execa from 'execa';

type FileLastUpdateData = {timestamp?: number; author?: string};

const GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX = /^(\d+), (.+)$/;

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

    const temp = str.match(GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX);
    return !temp || temp.length < 3
      ? null
      : {timestamp: +temp[1], author: temp[2]};
  }

  // Wrap in try/catch in case the shell commands fail
  // (e.g. project doesn't use Git, etc).
  try {
    if (!shell.which('git')) {
      if (!showedGitRequirementError) {
        showedGitRequirementError = true;
        console.warn('Sorry, the docs plugin last update options require Git.');
      }

      return null;
    }

    const {stdout} = await execa('git', [
      'log',
      '-1',
      '--format=%ct, %an',
      filePath,
    ]);
    return getTimestampAndAuthor(stdout);
  } catch (error) {
    console.error(error);
  }

  return null;
}
