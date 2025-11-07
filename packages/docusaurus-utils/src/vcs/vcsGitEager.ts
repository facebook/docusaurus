/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'node:path';
import logger, {PerfLogger} from '@docusaurus/logger';
import {getGitAllRepoRoots, getGitRepositoryFilesInfo} from './gitUtils';
import type {GitFileInfo, GitFileInfoMap} from './gitUtils';
import type {VcsConfig} from '@docusaurus/types';

function resolveFileInfoMapPaths(
  repoRoot: string,
  filesInfo: GitFileInfoMap,
): GitFileInfoMap {
  function transformMapEntry(
    entry: [string, GitFileInfo],
  ): [string, GitFileInfo] {
    // We just resolve the Git paths that are relative to the repo root
    return [resolve(repoRoot, entry[0]), entry[1]];
  }

  return new Map(Array.from(filesInfo.entries()).map(transformMapEntry));
}

function mergeFileMaps(fileMaps: GitFileInfoMap[]): GitFileInfoMap {
  return new Map(fileMaps.flatMap((m) => [...m]));
}

async function loadGitFileInfoMap(cwd: string): Promise<GitFileInfoMap> {
  return PerfLogger.async('loadGitFileInfoMap', async () => {
    const roots = await PerfLogger.async('getGitAllRepoRoots', () =>
      getGitAllRepoRoots(cwd),
    );

    const allMaps: GitFileInfoMap[] = await Promise.all(
      roots.map(async (root) => {
        const map = await PerfLogger.async(
          `getGitRepositoryFilesInfo for ${logger.path(cwd)}`,
          () => getGitRepositoryFilesInfo(cwd),
        );
        return resolveFileInfoMapPaths(root, map);
      }),
    );

    return mergeFileMaps(allMaps);
  });
}

function createGitVcsConfig(): VcsConfig {
  let filesMapPromise: Promise<GitFileInfoMap> | null = null;

  async function getGitFileInfo(filePath: string): Promise<GitFileInfo | null> {
    if (filesMapPromise === null) {
      filesMapPromise = loadGitFileInfoMap(process.cwd());
    }
    const filesMap = await filesMapPromise;
    return filesMap.get(filePath) ?? null;
  }

  return {
    initialize: ({siteDir}) => {
      console.trace('git eager init');
      // Only pre-init for production builds
      getGitFileInfo(siteDir).catch((error) => {
        console.error(
          'Failed to initialize the custom Docusaurus site Git VCS',
          error,
        );
      });
    },

    getFileCreationInfo: async (filePath: string) => {
      const fileInfo = await getGitFileInfo(filePath);
      return fileInfo?.creation ?? null;
    },

    getFileLastUpdateInfo: async (filePath: string) => {
      const fileInfo = await getGitFileInfo(filePath);
      return fileInfo?.lastUpdate ?? null;
    },
  };
}

export const VscGitEager: VcsConfig = createGitVcsConfig();
