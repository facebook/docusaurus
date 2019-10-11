/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import shell from 'shelljs';

type FileLastUpdateData = {timestamp?: number; author?: string};

const GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX = /^(\d+), (.+)$/;

export default function getFileLastUpdate(
  filePath: string,
): FileLastUpdateData | null {
  function isTimestampAndAuthor(str: string): boolean {
    return GIT_COMMIT_TIMESTAMP_AUTHOR_REGEX.test(str);
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

  // Wrap in try/catch in case the shell commands fail (e.g. project doesn't use Git, etc).
  try {
    // To differentiate between content change and file renaming / moving, use --summary
    // To follow the file history until before it is moved (when we create new version), use
    // --follow.
    const silentState = shell.config.silent; // Save old silent state.
    shell.config.silent = true;
    const result = shell
      .exec(`git log --follow --summary --format="%ct, %an" ${filePath}`)
      .stdout.trim();
    shell.config.silent = silentState;

    // Format the log results to be
    // ['1234567890, Yangshun Tay', 'rename ...', '1234567880,
    //  'Joel Marcey', 'move ...', '1234567870', '1234567860']
    const records = result
      .replace(/\n\s*\n/g, '\n')
      .split('\n')
      .filter(String);
    const lastContentModifierCommit = records.find((item, index, arr) => {
      const currentItemIsTimestampAndAuthor = isTimestampAndAuthor(item);
      const isLastTwoItem = index + 2 >= arr.length;
      const nextItemIsTimestampAndAuthor = isTimestampAndAuthor(arr[index + 1]);
      return (
        currentItemIsTimestampAndAuthor &&
        (isLastTwoItem || nextItemIsTimestampAndAuthor)
      );
    });

    return lastContentModifierCommit
      ? getTimestampAndAuthor(lastContentModifierCommit)
      : null;
  } catch (error) {
    console.error(error);
  }

  return null;
}
