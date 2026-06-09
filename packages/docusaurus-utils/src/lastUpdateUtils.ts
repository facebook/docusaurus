/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {getVcsPreset} from './vcs/vcs';

import type {VcsConfig} from '@docusaurus/types';

export type LastUpdateData = {
  /**
   * A timestamp in **milliseconds**, usually read from `git log`
   * `undefined`: not read
   * `null`: no value to read (usual for untracked files)
   */
  lastUpdatedAt: number | undefined | null;
  /**
   * The author's name, usually coming from `git log`
   * `undefined`: not read
   * `null`: no value to read (usual for untracked files)
   */
  lastUpdatedBy: string | undefined | null;
};

export type CreatedData = {
  /**
   * A timestamp in **milliseconds**, usually read from `git log`
   * `undefined`: not read
   * `null`: no value to read (usual for untracked files)
   */
  createdAt: number | undefined | null;
  /**
   * The author's name, usually coming from `git log`
   * `undefined`: not read
   * `null`: no value to read (usual for untracked files)
   */
  createdBy: string | undefined | null;
};

type LastUpdateOptions = {
  showLastUpdateAuthor: boolean;
  showLastUpdateTime: boolean;
};

type CreatedOptions = {
  showCreateAuthor: boolean;
  showCreateTime: boolean;
};

type FrontMatterAuthorDate = {
  author?: string;
  /**
   * Date can be any
   * [parsable date string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse).
   */
  date?: Date | string;
};

export type FrontMatterLastUpdate = FrontMatterAuthorDate;
export type FrontMatterCreated = FrontMatterAuthorDate;

async function readAuthorDateData(
  filePath: string,
  {
    showAuthor,
    showTime,
  }: {
    showAuthor: boolean;
    showTime: boolean;
  },
  frontMatter: FrontMatterAuthorDate | undefined,
  getFileInfo: (
    filePath: string,
  ) => Promise<{author?: string; timestamp?: number} | null>,
): Promise<{by: string | undefined | null; at: number | undefined | null}> {
  if (!showAuthor && !showTime) {
    return {by: undefined, at: undefined};
  }

  const frontMatterAuthor = frontMatter?.author;
  const frontMatterTimestamp = frontMatter?.date
    ? new Date(frontMatter.date).getTime()
    : undefined;

  const getInfoMemoized = _.memoize(() => getFileInfo(filePath));
  const getBy = () =>
    getInfoMemoized().then((update) => {
      if (update === null) {
        return null;
      }
      return update?.author;
    });
  const getAt = () =>
    getInfoMemoized().then((update) => {
      if (update === null) {
        return null;
      }
      return update?.timestamp;
    });

  const by = showAuthor ? (frontMatterAuthor ?? (await getBy())) : undefined;
  const at = showTime ? (frontMatterTimestamp ?? (await getAt())) : undefined;

  return {by, at};
}

// TODO Docusaurus v4: refactor/rename, make it clear this fn is only
//  for Markdown files with front matter shared by content plugin
export async function readLastUpdateData(
  filePath: string,
  options: LastUpdateOptions,
  lastUpdateFrontMatter: FrontMatterLastUpdate | undefined,
  vcsParam: Pick<VcsConfig, 'getFileLastUpdateInfo'>,
): Promise<LastUpdateData> {
  // We fallback to the default VSC config at runtime on purpose
  // It preserves retro-compatibility if a third-party plugin imports it
  // This also ensures unit tests keep working without extra setup
  // We still want to ensure type safety by requiring the VCS param
  // TODO Docusaurus v4: refactor all these Git read APIs
  const vcs = vcsParam ?? getVcsPreset('default-v1');

  const {showLastUpdateAuthor, showLastUpdateTime} = options;
  const {by: lastUpdatedBy, at: lastUpdatedAt} = await readAuthorDateData(
    filePath,
    {
      showAuthor: showLastUpdateAuthor,
      showTime: showLastUpdateTime,
    },
    lastUpdateFrontMatter,
    (pathParam) => vcs.getFileLastUpdateInfo(pathParam),
  );

  return {
    lastUpdatedBy,
    lastUpdatedAt,
  };
}

export async function readCreateData(
  filePath: string,
  options: CreatedOptions,
  createdFrontMatter: FrontMatterCreated | undefined,
  vcsParam: Pick<VcsConfig, 'getFileCreationInfo'>,
): Promise<CreatedData> {
  const vcs = vcsParam ?? getVcsPreset('default-v1');
  const {showCreateAuthor, showCreateTime} = options;
  const {by: createdBy, at: createdAt} = await readAuthorDateData(
    filePath,
    {
      showAuthor: showCreateAuthor,
      showTime: showCreateTime,
    },
    createdFrontMatter,
    (pathParam) => vcs.getFileCreationInfo(pathParam),
  );

  return {
    createdBy,
    createdAt,
  };
}
