/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {NumberPrefixParser} from './types';

// Best-effort to avoid parsing some patterns as number prefix
const IgnoredPrefixPatterns = (function () {
  // ignore common date-like patterns: https://github.com/facebook/docusaurus/issues/4640
  const DateLikePrefixRegex =
    /^((\d{2}|\d{4})[-_.]\d{2}([-_.](\d{2}|\d{4}))?)(.*)$/;

  // ignore common versioning patterns: https://github.com/facebook/docusaurus/issues/4653
  // note: we could try to parse float numbers in filenames but that is probably not worth it
  // as a version such as "8.0" can be interpreted as both a version and a float
  // User can configure his own NumberPrefixParser if he wants 8.0 to be interpreted as a float
  const VersionLikePrefixRegex = /^(\d+[-_.]\d+)(.*)$/;

  return new RegExp(
    `${DateLikePrefixRegex.source}|${VersionLikePrefixRegex.source}`,
  );
})();

const NumberPrefixRegex =
  /^(?<numberPrefix>\d+)(?<separator>\s*[-_.]+\s*)(?<suffix>.*)$/;

// 0-myDoc => {filename: myDoc, numberPrefix: 0}
// 003 - myDoc => {filename: myDoc, numberPrefix: 3}
export const DefaultNumberPrefixParser: NumberPrefixParser = (
  filename: string,
) => {
  if (IgnoredPrefixPatterns.exec(filename)) {
    return {filename, numberPrefix: undefined};
  }
  const match = NumberPrefixRegex.exec(filename);
  const cleanFileName = match?.groups?.suffix ?? filename;
  const numberPrefixString = match?.groups?.numberPrefix;
  const numberPrefix = numberPrefixString
    ? parseInt(numberPrefixString, 10)
    : undefined;
  return {
    filename: cleanFileName,
    numberPrefix,
  };
};

export const DisabledNumberPrefixParser: NumberPrefixParser = (
  filename: string,
) => ({filename, numberPrefix: undefined});

// 0-myDoc => myDoc
export function stripNumberPrefix(
  str: string,
  parser: NumberPrefixParser,
): string {
  return parser(str).filename;
}

// 0-myFolder/0-mySubfolder/0-myDoc => myFolder/mySubfolder/myDoc
export function stripPathNumberPrefixes(
  path: string,
  parser: NumberPrefixParser,
): string {
  return path
    .split('/')
    .map((segment) => stripNumberPrefix(segment, parser))
    .join('/');
}
