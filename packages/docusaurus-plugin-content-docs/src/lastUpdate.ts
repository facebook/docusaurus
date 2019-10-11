/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import shell from 'shelljs';
import spawn from 'cross-spawn';

type FileLastUpdateData = {timestamp?: number; author?: string};

const GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX = /^(\d+), (.+)$/;

let showedGitRequirementError = false;

export default function getFileLastUpdate(
  filePath: string,
): FileLastUpdateData | null {
  function getTimestampAndAuthor(str: string): FileLastUpdateData | null {
    if (!str) {
      return null;
    }

    const temp = str.match(GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX);
    return !temp || temp.length < 3
      ? null
      : {timestamp: +temp[1], author: temp[2]};
  }

  // Wrap in try/catch in case the shell commands fail (e.g. project doesn't use Git, etc).
  try {
    if (!shell.which('git')) {
      if (!showedGitRequirementError) {
        showedGitRequirementError = true;
        console.log('Sorry, the docs plugin last update options require Git.');
      }

      return null;
    }

    const result = spawn
      .sync('git', ['log', '-1', '--format=%ct, %an', filePath])
      .stdout.toString()
      .trim();

    return getTimestampAndAuthor(result);
  } catch (error) {
    console.error(error);
  }

  return null;
}
