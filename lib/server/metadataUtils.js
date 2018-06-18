/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// split markdown header
function splitHeader(content) {
  // New line characters need to handle all operating systems.
  const lines = content.split(/\r?\n/);
  if (lines[0] !== '---') {
    return {};
  }
  let i = 1;
  for (; i < lines.length - 1; ++i) {
    if (lines[i] === '---') {
      break;
    }
  }
  return {
    header: lines.slice(1, i + 1).join('\n'),
    content: lines.slice(i + 1).join('\n'),
  };
}

// Extract markdown metadata header
function extractMetadata(content) {
  const metadata = {};
  const both = splitHeader(content);

  // if no content returned, then that means there was no header, and both.header is the content
  if (!both.content) {
    if (!both.header) {
      // if no both returned, then that means there was no header and no content => we return the current content of the file
      return {metadata, rawContent: content};
    }
    return {metadata, rawContent: both.header};
  }

  // New line characters => to handle all operating systems.
  const lines = both.header.split(/\r?\n/);

  // Loop that add to metadata the current content of the fields of the header
  // Like the format:
  // id:
  // title:
  // original_id:
  for (let i = 0; i < lines.length - 1; ++i) {
    const keyvalue = lines[i].split(':');
    const key = keyvalue[0].trim();
    let value = keyvalue
      .slice(1)
      .join(':')
      .trim();
    try {
      value = JSON.parse(value);
    } catch (e) {}
    metadata[key] = value;
  }
  return {metadata, rawContent: both.content};
}

module.exports = {
  extractMetadata,
};
