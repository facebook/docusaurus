/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RawData, Data} from './types';

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
  for (let i = 0; i < lines.length - 1; i += 1) {
    const keyvalue = lines[i].split(':');
    const key = keyvalue[0].trim();
    let value = keyvalue.slice(1).join(':').trim();
    try {
      value = JSON.parse(value);
    } catch (err) {
      // Ignore the error as it means it's not a JSON value.
    }
    metadata[key] = value;
  }
  return {metadata, rawContent: both.content};
}
