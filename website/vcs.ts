/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'node:path';
import {realpath} from 'node:fs/promises';
import execa from 'execa';
import {DEFAULT_VCS_CONFIG} from '@docusaurus/utils';
import {PerfLogger} from '@docusaurus/logger';
import type {VcsConfig} from '@docusaurus/types';

async function getRepoRoot(cwd: string): Promise<string> {
  const result = await execa('git', ['rev-parse', '--show-toplevel'], {
    cwd,
  });

  if (result.exitCode !== 0) {
    throw new Error(
      `Failed to retrieve the git repository root with exit code ${result.exitCode}: ${result.stderr}`,
    );
  }

  return realpath(result.stdout.trim());
}

type CommitInfo = {timestamp: number; author: string};

type CommitInfoMap = Map<string, CommitInfo>;

// Logic inspired from Astro Starlight:
// See https://bsky.app/profile/bluwy.me/post/3lyihod6qos2a
// See https://github.com/withastro/starlight/blob/c417f1efd463be63b7230617d72b120caed098cd/packages/starlight/utils/git.ts#L58
async function getAllNewestCommitDate(cwd: string): Promise<CommitInfoMap> {
  const repoRoot = await getRepoRoot(cwd);

  // git log --format=t:%ct,a:%an --name-status
  const result = await execa(
    'git',
    [
      'log',
      // Format each history entry as t:<seconds since epoch>
      '--format=t:%ct,a:%an',
      // In each entry include the name and status for each modified file
      '--name-status',
    ],
    {
      cwd: repoRoot,
      encoding: 'utf-8',
      // TODO use streaming to avoid a large buffer
      // See https://github.com/withastro/starlight/issues/3154
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  if (result.exitCode !== 0) {
    throw new Error(
      `Docusaurus failed to run the 'git log' to retrieve tracked files last update date/author.
The command exited with code ${result.exitCode}: ${result.stderr}`,
    );
  }

  const logLines = result.stdout.split('\n');

  // TODO not fail-fast
  let runningDate = Date.now();
  let runningAuthor = 'N/A';
  const runningMap: CommitInfoMap = new Map();

  for (const logLine of logLines) {
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
    if (tabSplit === -1) {
      continue;
    }
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
    // We just resolve the Git paths that are relative to the repo root
    return [resolve(repoRoot, entry[0]), entry[1]];
  }

  return new Map(Array.from(runningMap.entries()).map(transformMapEntry));
}

async function getGitRepoLastCommitInfoMap(
  cwd: string,
): Promise<CommitInfoMap> {
  return PerfLogger.async('getGitRepoLastCommitInfoMap', () => {
    return getAllNewestCommitDate(cwd);
  });
}

const isBuild = true; // TODO

function createCustomVcsConfig(): VcsConfig {
  if (process.env.DOCUSAURUS_WEBSITE_USE_OLD_VCS_STRATEGY === 'true') {
    console.log("Using the old Docusaurus website's VCS strategy");
    return DEFAULT_VCS_CONFIG;
  }

  if (!isBuild) {
    return DEFAULT_VCS_CONFIG;
  }

  let repoInfoPromise: Promise<CommitInfoMap> | null = null;

  async function getRepoInfoForFile(
    filePath: string,
  ): Promise<CommitInfo | null> {
    if (repoInfoPromise === null) {
      repoInfoPromise = getGitRepoLastCommitInfoMap(process.cwd());
    }

    const repoInfo = await repoInfoPromise;

    return repoInfo.get(filePath) ?? null;
  }

  // Try to pre-read the Git repository info as soon as possible

  // TODO pre-init here doesn't work because of double config loading
  /*
  getRepoInfoForFile('.').catch((e) => {
    console.error('Failed to read the Docusaurus Git repository info', e);
  });

   */

  return {
    initialize: ({siteDir}) => {
      console.log('initializing custom site VCS config...');
      getRepoInfoForFile(siteDir).catch((e) => {
        console.error('Failed to read the Docusaurus Git repository info', e);
      });
    },

    getFileCreationInfo: async (filePath: string) => {
      return DEFAULT_VCS_CONFIG.getFileCreationInfo(filePath);
    },

    getFileLastUpdateInfo: async (filePath: string) => {
      return getRepoInfoForFile(filePath);
    },
  };
}

export const customSiteVcsImplementation: VcsConfig = createCustomVcsConfig();
