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

let showedLastUpdateGitRequirementError = false;
let showedLastUpdateFileNotTrackedError = false;

export async function getFileLastUpdate(
  filePath?: string,
): Promise<{timestamp: number; author: string} | null> {
  if (!filePath) {
    return null;
  }

  // Wrap in try/catch in case the shell commands fail
  // (e.g. project doesn't use Git, etc).
  try {
    const result = getFileCommitDate(filePath, {
      age: 'newest',
      includeAuthor: true,
    });
    return {timestamp: result.timestamp, author: result.author};
  } catch (err) {
    if (err instanceof GitNotFoundError) {
      if (!showedLastUpdateGitRequirementError) {
        logger.warn('Sorry, the docs plugin last update options require Git.');
        showedLastUpdateGitRequirementError = true;
      }
    } else if (err instanceof FileNotTrackedError) {
      if (!showedLastUpdateFileNotTrackedError) {
        logger.warn(
          'Cannot infer the update date for some files, as they are not tracked by git.',
        );
        showedLastUpdateFileNotTrackedError = true;
      }
    } else {
      logger.warn(err);
    }
    return null;
  }
}

let showedCreationGitRequirementError = false;
let showedCreationFileNotTrackedError = false;

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
      if (!showedCreationGitRequirementError) {
        logger.warn('Sorry, the docs plugin create options require Git.');
        showedCreationGitRequirementError = true;
      }
    } else if (err instanceof FileNotTrackedError) {
      if (!showedCreationFileNotTrackedError) {
        logger.warn(
          'Cannot infer the create date for some files, as they are not tracked by git.',
        );
        showedCreationFileNotTrackedError = true;
      }
    } else {
      logger.warn(err);
    }
    return null;
  }
}
