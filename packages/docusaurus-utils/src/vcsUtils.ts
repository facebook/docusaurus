/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getFileCommitDate} from './gitUtils';
import {getLastUpdate} from './lastUpdateUtils';
import type {VcsConfig} from '@docusaurus/types';

export const DEFAULT_VCS_CONFIG: VcsConfig = {
  getFileCreationInfo: async (filePath: string) => {
    return getFileCommitDate(filePath, {
      age: 'oldest',
      includeAuthor: true,
    });
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
