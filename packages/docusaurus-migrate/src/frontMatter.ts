/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {RawData, Data} from './types';

function splitHeader(content: string): RawData {
  // New line characters need to handle all operating systems.
  const lines = content.split(/\r?\n/);
  if (lines[0] !== '---') {
    return {};
  }
  let i = 1;
  for (; i < lines.length - 1; i = 1 + i) {
    if (lines[i] === '---') {
      break;
    }
  }
  return {
    header: lines.slice(1, i + 1).join('\n'),
    content: lines.slice(i + 1).join('\n'),
  };
}

export default function extractMetadata(content: string): Data {
  const metadata: {[key: string]: string} = {};
  const both = splitHeader(content);
  if (!both.content) {
    if (!both.header) {
      return {metadata, rawContent: content};
    }
    return {metadata, rawContent: both.header};
  }

  // New line characters => to handle all operating systems.
  const lines = (both.header ?? '').split(/\r?\n/);
  lines.slice(0, -1).forEach((line) => {
    const keyValue = line.split(':') as [string, ...string[]];
    const key = keyValue[0].trim();
    const value = keyValue.slice(1).join(':').trim();
    metadata[key] = value;
  });
  return {metadata, rawContent: both.content};
}

// The new front matter parser need some special chars to
export function shouldQuotifyFrontMatter([key, value]: [
  string,
  string,
]): boolean {
  if (key === 'tags') {
    return false;
  }
  if (String(value).match(/^(?<quote>["']).+\1$/)) {
    return false;
  }
  // title: !something needs quotes because otherwise it's a YAML tag.
  if (!String(value).trim().match(/^\w.*/)) {
    return true;
  }
  // TODO this is not ideal to have to maintain such a list of allowed chars
  // maybe we should quotify if gray-matter throws instead?
  return !String(value).match(
    // cSpell:ignore àáâãäåçèéêëìíîïðòóôõöùúûüýÿ
    /^[\w .\-àáâãäåçèéêëìíîïðòóôõöùúûüýÿ!;,=+?'`&#()[\]§%€$]+$/,
  );
}
