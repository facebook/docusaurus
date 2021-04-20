/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NumberPrefixRegex = /^(?<numberPrefix>\d+)(?<separator>\s*[-_.]+\s*)(?<suffix>.*)$/;

// 0-myDoc => myDoc
export function stripNumberPrefix(str: string) {
  return NumberPrefixRegex.exec(str)?.groups?.suffix ?? str;
}

// 0-myFolder/0-mySubfolder/0-myDoc => myFolder/mySubfolder/myDoc
export function stripPathNumberPrefixes(path: string) {
  return path.split('/').map(stripNumberPrefix).join('/');
}

// 0-myDoc => {filename: myDoc, numberPrefix: 0}
// 003 - myDoc => {filename: myDoc, numberPrefix: 3}
export function extractNumberPrefix(
  filename: string,
): {filename: string; numberPrefix?: number} {
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
}
