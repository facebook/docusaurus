/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {getFileCommitDate, GitNotFoundError} from '@docusaurus/utils';

type FileLastUpdateData = {timestamp?: number; author?: string};

let showedGitRequirementError = false;

export async function getFileLastUpdate(
  filePath?: string,
): Promise<FileLastUpdateData | null> {
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
    if (err instanceof GitNotFoundError && !showedGitRequirementError) {
      logger.warn('Sorry, the docs plugin last update options require Git.');
      showedGitRequirementError = true;
    } else {
      logger.error(err);
    }
    return null;
  }
}
