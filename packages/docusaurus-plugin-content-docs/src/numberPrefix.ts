/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {NumberPrefixParser} from './types';

const DatePrefixRegex = /^((\d{2}|\d{4})[-_.]\d{2}([-_.](\d{2}|\d{4}))?)(.*)$/;

const NumberPrefixRegex = /^(?<numberPrefix>\d+)(?<separator>\s*[-_.]+\s*)(?<suffix>.*)$/;

// 0-myDoc => {filename: myDoc, numberPrefix: 0}
// 003 - myDoc => {filename: myDoc, numberPrefix: 3}
export const DefaultNumberPrefixParser: NumberPrefixParser = (
  filename: string,
) => {
  if (DatePrefixRegex.exec(filename)) {
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
