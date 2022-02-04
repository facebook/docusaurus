/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {getCommitterDateForFile} from '@docusaurus/utils';

type FileLastUpdateData = {timestamp?: number; author?: string};

export async function getFileLastUpdate(
  filePath?: string,
): Promise<FileLastUpdateData | null> {
  if (!filePath) {
    return null;
  }

  // Wrap in try/catch in case the shell commands fail
  // (e.g. project doesn't use Git, etc).
  let result;
  try {
    result = getCommitterDateForFile(filePath, {
      age: 'newest',
      includeAuthor: true,
    });
  } catch (e) {
    logger.error(e);
    return null;
  }
  return {timestamp: result.timestamp, author: result.author};
}
