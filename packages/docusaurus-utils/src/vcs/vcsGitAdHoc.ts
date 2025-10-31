/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  FileNotTrackedError,
  getFileCommitDate,
  GitNotFoundError,
} from './gitUtils';
import {getLastUpdate} from '../lastUpdateUtils';
import type {VcsConfig} from '@docusaurus/types';

/**
 * A VCS strategy to query Git information in an ad-hoc way.
 * This is the default/historical Docusaurus Git VCS implementation.
 * Unfortunately, it is a major bottleneck for large sites/repositories.
 *
 * See also https://github.com/facebook/docusaurus/issues/11208
 */
export const VcsGitAdHoc: VcsConfig = {
  initialize: () => {
    // Nothing to do here for the default/historical Git implementation
  },

  getFileCreationInfo: async (filePath: string) => {
    try {
      return await getFileCommitDate(filePath, {
        age: 'oldest',
        includeAuthor: true,
      });
    } catch (error) {
      // TODO Docusaurus v4: remove this logic using exceptions for control flow
      //  We add this logic to make it similar to getLastUpdate() that also
      //  returns null in these case and does not throw
      if (error instanceof GitNotFoundError) {
        return null;
      } else if (error instanceof FileNotTrackedError) {
        return null;
      } else {
        throw new Error(
          `An error occurred when trying to get the last update date`,
          {cause: error},
        );
      }
    }
  },

  getFileLastUpdateInfo: async (filePath: string) => {
    // TODO non-ideal integration but good enough for now
    // This keeps this new VscConfig system retro-compatible with the existing
    // historical Docusaurus behavior based on Git
    const result = await getLastUpdate(filePath);
    if (result === null) {
      return null;
    }
    return {
      timestamp: result.lastUpdatedAt!,
      author: result.lastUpdatedBy!,
    };
  },
};
