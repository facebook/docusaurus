/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {
  FileNotTrackedError,
  GitNotFoundError,
  getFileCommitDate,
} from './gitUtils';
import type {PluginOptions} from '@docusaurus/types';

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
        logger.warn('Sorry, the docs plugin last update options require Git.');
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
  if (showLastUpdateAuthor || showLastUpdateTime) {
    const frontMatterTimestamp = lastUpdateFrontMatter?.date
      ? new Date(lastUpdateFrontMatter.date).getTime() / 1000
      : undefined;

    if (lastUpdateFrontMatter?.author && lastUpdateFrontMatter.date) {
      return {
        lastUpdatedAt: frontMatterTimestamp,
        lastUpdatedBy: lastUpdateFrontMatter.author,
      };
    }

    // Use fake data in dev for faster development.
    const fileLastUpdateData =
      process.env.NODE_ENV === 'production'
        ? await getFileLastUpdate(filePath)
        : {
            author: 'Author',
            timestamp: 1539502055,
          };
    const {author, timestamp} = fileLastUpdateData ?? {};

    return {
      lastUpdatedBy: showLastUpdateAuthor
        ? lastUpdateFrontMatter?.author ?? author
        : undefined,
      lastUpdatedAt: showLastUpdateTime
        ? frontMatterTimestamp ?? timestamp
        : undefined,
    };
  }

  return {};
}
