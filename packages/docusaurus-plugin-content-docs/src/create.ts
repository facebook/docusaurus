/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {
  getFileCommitDate,
  FileNotTrackedError,
  GitNotFoundError,
} from '@docusaurus/utils';

let showedGitRequirementError = false;
let showedFileNotTrackedError = false;

export async function getFileCreate(
  filePath?: string,
): Promise<{timestamp: number; author: string} | null> {
  if (!filePath) {
    return null;
  }

  // Wrap in try/catch in case the shell commands fail
  // (e.g. project doesn't use Git, etc).
  try {
    const result = getFileCommitDate(filePath, {
      age: 'oldest',
      includeAuthor: true,
    });
    return {timestamp: result.timestamp, author: result.author};
  } catch (err) {
    if (err instanceof GitNotFoundError) {
      if (!showedGitRequirementError) {
        logger.warn('Sorry, the docs plugin create options require Git.');
        showedGitRequirementError = true;
      }
    } else if (err instanceof FileNotTrackedError) {
      if (!showedFileNotTrackedError) {
        logger.warn(
          'Cannot infer the create date for some files, as they are not tracked by git.',
        );
        showedFileNotTrackedError = true;
      }
    } else {
      logger.warn(err);
    }
    return null;
  }
}
