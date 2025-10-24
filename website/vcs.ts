/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'node:path';
import {realpath} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {DEFAULT_VCS_CONFIG} from '@docusaurus/utils';
import {PerfLogger} from '@docusaurus/logger';
import type {VcsConfig} from '@docusaurus/types';

async function getRepoRoot(directory: string): Promise<string> {
  const result = spawnSync('git', ['rev-parse', '--show-toplevel'], {
    cwd: directory,
    encoding: 'utf-8',
  });
  if (result.error) {
    return directory;
  }
  return realpath(result.stdout.trim());
}

type CommitInfo = {timestamp: number; author: string};

type CommitInfoMap = Map<string, CommitInfo>;

// Logic inspired from Astro Starlight:
// See https://bsky.app/profile/bluwy.me/post/3lyihod6qos2a
// See https://github.com/withastro/starlight/blob/c417f1efd463be63b7230617d72b120caed098cd/packages/starlight/utils/git.ts#L58
async function getAllNewestCommitDate(
  rootPath: string,
  docsPath: string,
): Promise<CommitInfoMap> {
  const repoRoot = await getRepoRoot(docsPath);

  // git log --format=t:%ct,a:%an --name-status
  const gitLog = spawnSync(
    'git',
    [
      'log',
      // Format each history entry as t:<seconds since epoch>
      '--format=t:%ct,a:%an',
      // In each entry include the name and status for each modified file
      '--name-status',
      '--',
      docsPath,
    ],
    {
      cwd: repoRoot,
      encoding: 'utf-8',
      // The default `maxBuffer` for `spawnSync` is 1024 * 1024 bytes, a.k.a 1 MB. In big projects,
      // the full git history can be larger than this, so we increase this to ~10 MB. For example,
      // Cloudflare passed 1 MB with ~4,800 pages and ~17,000 commits. If we get reports of others
      // hitting ENOBUFS errors here in the future, we may want to switch to streaming the git log
      // with `spawn` instead.
      // See https://github.com/withastro/starlight/issues/3154
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  if (gitLog.error) {
    throw new Error("can't read Git repository", {cause: gitLog.error});
  }

  // TODO not fail-fast
  let runningDate = Date.now();
  let runningAuthor = 'N/A';
  const runningMap: CommitInfoMap = new Map();

  for (const logLine of gitLog.stdout.split('\n')) {
    if (logLine.startsWith('t:')) {
      // t:<timestamp>,a:<author name>
      const [timestampStr, authorStr] = logLine.split(',') as [string, string];
      const timestamp = Number.parseInt(timestampStr.slice(2), 10) * 1000;
      const author = authorStr.slice(2);

      runningDate = timestamp;
      runningAuthor = author;
    }

    // - Added files take the format `A\t<file>`
    // - Modified files take the format `M\t<file>`
    // - Deleted files take the format `D\t<file>`
    // - Renamed files take the format `R<count>\t<old>\t<new>`
    // - Copied files take the format `C<count>\t<old>\t<new>`
    // The name of the file as of the commit being processed is always
    // the last part of the log line.
    const tabSplit = logLine.lastIndexOf('\t');
    if (tabSplit === -1) {continue;}
    const relativeFile = logLine.slice(tabSplit + 1);

    const currentLatest = runningMap.get(relativeFile)?.timestamp || 0;
    const newLatest = Math.max(currentLatest, runningDate);

    if (newLatest !== currentLatest) {
      runningMap.set(relativeFile, {
        timestamp: runningDate,
        author: runningAuthor,
      });
    }
  }

  function transformMapEntry(
    entry: [string, CommitInfo],
  ): [string, CommitInfo] {
    const [relativeFile, info] = entry;
    const fileFullPath = resolve(repoRoot, relativeFile);
    return [fileFullPath, info];
    // let fileInDirectory = relative(rootPath, fileFullPath);
    // Format path to unix style path.
    // fileInDirectory = fileInDirectory?.replace(/\\/g, '/');
    // return [fileInDirectory, info];
  }

  return new Map(Array.from(runningMap.entries()).map(transformMapEntry));
}

async function getFullRepoLastCommitInfoMap(): Promise<CommitInfoMap> {
  const allData = await PerfLogger.async('getAllNewestCommitDate', () => {
    return getAllNewestCommitDate('.', '.');
  });

  return allData;
}

const isBuild = true; // TODO

function createCustomVcsConfig(): VcsConfig {
  if (!isBuild) {
    return DEFAULT_VCS_CONFIG;
  }

  let repoInfoPromise: Promise<CommitInfoMap> | null = null;

  async function getRepoInfoForFile(
    filePath: string,
  ): Promise<CommitInfo | null> {
    if (repoInfoPromise === null) {
      repoInfoPromise = getFullRepoLastCommitInfoMap();
    }

    const repoInfo = await repoInfoPromise;

    return repoInfo.get(filePath) ?? null;
  }

  return {
    getFileCreationInfo: async (filePath: string) => {
      return DEFAULT_VCS_CONFIG.getFileCreationInfo(filePath);
    },
    getFileLastUpdateInfo: async (filePath: string) => {
      return getRepoInfoForFile(filePath);
    },
  };
}

export const customSiteVcsImplementation: VcsConfig = createCustomVcsConfig();
