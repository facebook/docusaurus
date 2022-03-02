/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import Yaml from 'js-yaml';
import path from 'path';
import {findAsyncSequential} from './index';
import type {ContentPaths} from './markdownLinks';
import logger from '@docusaurus/logger';

type DataFileParams = {
  filePath: string;
  contentPaths: ContentPaths;
};

export async function getDataFilePath({
  filePath,
  contentPaths,
}: DataFileParams): Promise<string | undefined> {
  // Loads a localized data file in priority
  const contentPath = await findFolderContainingFile(
    getContentPathList(contentPaths),
    filePath,
  );
  if (contentPath) {
    return path.join(contentPath, filePath);
  }
  return undefined;
}

/**
 * Looks up for a data file in the content paths, returns the normalized object.
 * Throws when validation fails; returns undefined when file not found
 */
export async function getDataFileData<T>(
  params: DataFileParams & {fileType: string},
  validate: (content: unknown) => T,
): Promise<T | undefined> {
  const filePath = await getDataFilePath(params);
  if (!filePath) {
    return undefined;
  }
  try {
    const contentString = await fs.readFile(filePath, {encoding: 'utf8'});
    const unsafeContent = Yaml.load(contentString);
    return validate(unsafeContent);
  } catch (err) {
    // TODO replace later by error cause, see https://v8.dev/features/error-cause
    logger.error`The ${params.fileType} file at path=${filePath} looks invalid.`;
    throw err;
  }
}

// Order matters: we look in priority in localized folder
export function getContentPathList(contentPaths: ContentPaths): string[] {
  return [contentPaths.contentPathLocalized, contentPaths.contentPath];
}

// return the first folder path in which the file exists in
export async function findFolderContainingFile(
  folderPaths: string[],
  relativeFilePath: string,
): Promise<string | undefined> {
  return findAsyncSequential(folderPaths, (folderPath) =>
    fs.pathExists(path.join(folderPath, relativeFilePath)),
  );
}

export async function getFolderContainingFile(
  folderPaths: string[],
  relativeFilePath: string,
): Promise<string> {
  const maybeFolderPath = await findFolderContainingFile(
    folderPaths,
    relativeFilePath,
  );
  // should never happen, as the source was read from the FS anyway...
  if (!maybeFolderPath) {
    throw new Error(
      `File "${relativeFilePath}" does not exist in any of these folders:\n- ${folderPaths.join(
        '\n- ',
      )}]`,
    );
  }
  return maybeFolderPath;
}
