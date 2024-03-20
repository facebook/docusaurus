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

export type LastUpdateData = {
  /** A timestamp in **milliseconds**, usually read from `git log` */
  lastUpdatedAt?: number;
  /** The author's name, usually coming from `git log` */
  lastUpdatedBy?: string;
};

let showedGitRequirementError = false;
let showedFileNotTrackedError = false;

export async function getGitLastUpdate(
  filePath: string,
): Promise<LastUpdateData | null> {
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

    return {lastUpdatedAt: result.timestamp, lastUpdatedBy: result.author};
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

export const LAST_UPDATE_FALLBACK: LastUpdateData = {
  lastUpdatedAt: 1539502055000,
  lastUpdatedBy: 'Author',
};

export async function getLastUpdate(
  filePath: string,
): Promise<LastUpdateData | null> {
  if (process.env.NODE_ENV !== 'production') {
    // Use fake data in dev/test for faster development.
    return LAST_UPDATE_FALLBACK;
  }
  return getGitLastUpdate(filePath);
}

type LastUpdateOptions = Pick<
  PluginOptions,
  'showLastUpdateAuthor' | 'showLastUpdateTime'
>;

export type FrontMatterLastUpdate = {
  author?: string;
  /**
   * Date can be any
   * [parsable date string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
   */
  date?: Date | string;
};

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
    ? new Date(lastUpdateFrontMatter.date).getTime()
    : undefined;

  // We try to minimize git last update calls
  // We call it at most once
  // If all the data is provided as front matter, we do not call it
  const getLastUpdateMemoized = _.memoize(() => getLastUpdate(filePath));
  const getLastUpdateBy = () =>
    getLastUpdateMemoized().then((update) => update?.lastUpdatedBy);
  const getLastUpdateAt = () =>
    getLastUpdateMemoized().then((update) => update?.lastUpdatedAt);

  const lastUpdatedBy = showLastUpdateAuthor
    ? frontMatterAuthor ?? (await getLastUpdateBy())
    : undefined;

  const lastUpdatedAt = showLastUpdateTime
    ? frontMatterTimestamp ?? (await getLastUpdateAt())
    : undefined;

  return {
    lastUpdatedBy,
    lastUpdatedAt,
  };
}
