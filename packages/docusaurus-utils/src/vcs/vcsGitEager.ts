/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve, basename} from 'node:path';
import logger, {PerfLogger} from '@docusaurus/logger';
import {getGitAllRepoRoots, getGitRepositoryFilesInfo} from './gitUtils';
import type {GitFileInfo, GitFileInfoMap} from './gitUtils';
import type {VcsConfig} from '@docusaurus/types';

// The Map keys should be absolute file paths, not relative Git paths
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

async function loadAllGitFilesInfoMap(cwd: string): Promise<GitFileInfoMap> {
  const roots = await PerfLogger.async('Reading Git root dirs', () =>
    getGitAllRepoRoots(cwd),
  );

  const allMaps: GitFileInfoMap[] = await Promise.all(
    roots.map(async (root) => {
      const map = await PerfLogger.async(
        `Reading Git history for repo ${logger.path(basename(root))}`,
        () => getGitRepositoryFilesInfo(root),
      );
      return resolveFileInfoMapPaths(root, map);
    }),
  );

  return mergeFileMaps(allMaps);
}

function createVcsUninitializedPromise(): Promise<GitFileInfoMap> {
  const promise = Promise.reject(
    new Error('Docusaurus Git Eager VCS strategy has not been initialized yet'),
  );
  promise.catch(() => {}); // Avoid unhandled promise rejection error + app exit
  return promise;
}

function createGitVcsConfig(): VcsConfig {
  let filesMapPromise: Promise<GitFileInfoMap> =
    createVcsUninitializedPromise();

  async function getGitFileInfo(filePath: string): Promise<GitFileInfo | null> {
    const filesMap = await filesMapPromise;
    return filesMap.get(filePath) ?? null;
  }

  return {
    initialize: ({siteDir}) => {
      filesMapPromise = PerfLogger.async('Git Eager VCS init', () =>
        loadAllGitFilesInfoMap(siteDir),
      );
      filesMapPromise.catch((error) => {
        console.error(
          'Failed to initialize the Docusaurus Git Eager VCS strategy',
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
