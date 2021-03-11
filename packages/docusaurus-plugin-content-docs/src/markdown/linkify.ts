/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DocsMarkdownOption} from '../types';
import {getDocsDirPaths} from '../versions';
import {replaceMarkdownLinks} from '@docusaurus/utils/lib/markdownLinks';

function getVersion(filePath: string, options: DocsMarkdownOption) {
  const versionFound = options.versionsMetadata.find((version) =>
    getDocsDirPaths(version).some((docsDirPath) =>
      filePath.startsWith(docsDirPath),
    ),
  );
  if (!versionFound) {
    throw new Error(
      `Unexpected, markdown file does not belong to any docs version! file=${filePath}`,
    );
  }
  return versionFound;
}

export function linkify(
  fileString: string,
  filePath: string,
  options: DocsMarkdownOption,
): string {
  const version = getVersion(filePath, options);
  return replaceMarkdownLinks(
    fileString,
    filePath,
    version,
    options,
    (permalink) => permalink,
  );
}
