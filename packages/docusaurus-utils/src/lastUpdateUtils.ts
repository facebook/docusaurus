/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {
  FileNotTrackedError,
  GitNotFoundError,
  getFileCommitDate,
} from './gitUtils';
import type {PluginOptions} from '@docusaurus/types';

export const GIT_FALLBACK_LAST_UPDATE_DATE = 1539502055;

export const GIT_FALLBACK_LAST_UPDATE_AUTHOR = 'Author';

async function getGitLastUpdate(filePath: string): Promise<LastUpdateData> {
  if (process.env.NODE_ENV !== 'production') {
    // Use fake data in dev/test for faster development.
    return {
      lastUpdatedBy: GIT_FALLBACK_LAST_UPDATE_AUTHOR,
      lastUpdatedAt: GIT_FALLBACK_LAST_UPDATE_DATE,
    };
  }
  const {author, timestamp} = (await getFileLastUpdate(filePath)) ?? {};
  return {lastUpdatedBy: author, lastUpdatedAt: timestamp};
}

export type LastUpdateData = {
  /** A timestamp in **seconds**, directly acquired from `git log`. */
  lastUpdatedAt?: number;
  /** The author's name directly acquired from `git log`. */
  lastUpdatedBy?: string;
};

export type FrontMatterLastUpdate = {
  author?: string;
  /** Date can be any
   * [parsable date string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
   */
  date?: Date | string;
};

let showedGitRequirementError = false;
let showedFileNotTrackedError = false;

export async function getFileLastUpdate(
  filePath: string,
): Promise<{timestamp: number; author: string} | null> {
  if (!filePath) {
    return null;
  }

  // Wrap in try/catch in case the shell commands fail
  // (e.g. project doesn't use Git, etc).
  try {
    const result = await getFileCommitDate(filePath, {
      age: 'newest',
      includeAuthor: true,
    });

    return {timestamp: result.timestamp, author: result.author};
  } catch (err) {
    if (err instanceof GitNotFoundError) {
      if (!showedGitRequirementError) {
        logger.warn('Sorry, the last update options require Git.');
        showedGitRequirementError = true;
      }
    } else if (err instanceof FileNotTrackedError) {
      if (!showedFileNotTrackedError) {
        logger.warn(
          'Cannot infer the update date for some files, as they are not tracked by git.',
        );
        showedFileNotTrackedError = true;
      }
    } else {
      throw new Error(
        `An error occurred when trying to get the last update date`,
        {cause: err},
      );
    }
    return null;
  }
}

type LastUpdateOptions = Pick<
  PluginOptions,
  'showLastUpdateAuthor' | 'showLastUpdateTime'
>;

export async function readLastUpdateData(
  filePath: string,
  options: LastUpdateOptions,
  lastUpdateFrontMatter: FrontMatterLastUpdate | undefined,
): Promise<LastUpdateData> {
  const {showLastUpdateAuthor, showLastUpdateTime} = options;

  if (!showLastUpdateAuthor && !showLastUpdateTime) {
    return {};
  }

  const frontMatterAuthor = lastUpdateFrontMatter?.author;
  const frontMatterTimestamp = lastUpdateFrontMatter?.date
    ? new Date(lastUpdateFrontMatter.date).getTime() / 1000
    : undefined;

  // We try to minimize git last update calls
  // We call it at most once
  // If all the data is provided as front matter, we do not call it
  const getGitLastUpdateMemoized = _.memoize(() => getGitLastUpdate(filePath));
  const getGitLastUpdateBy = () =>
    getGitLastUpdateMemoized().then((update) => update.lastUpdatedBy);
  const getGitLastUpdateAt = () =>
    getGitLastUpdateMemoized().then((update) => update.lastUpdatedAt);

  const lastUpdatedBy = showLastUpdateAuthor
    ? frontMatterAuthor ?? (await getGitLastUpdateBy())
    : undefined;

  const lastUpdatedAt = showLastUpdateTime
    ? frontMatterTimestamp ?? (await getGitLastUpdateAt())
    : undefined;

  return {
    lastUpdatedBy,
    lastUpdatedAt,
  };
}
