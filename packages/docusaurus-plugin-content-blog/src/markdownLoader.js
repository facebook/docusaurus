/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {parseQuery} = require('loader-utils');

const TRUNCATE_MARKER = /<!--\s*truncate\s*-->/;

module.exports = async function(fileString) {
  const callback = this.async();

  let finalContent = fileString;

  // Truncate content if requested (e.g: file.md?truncated=true)
  const {truncated} = this.resourceQuery && parseQuery(this.resourceQuery);
  if (truncated && TRUNCATE_MARKER.test(fileString)) {
    // eslint-disable-next-line
    finalContent = fileString.split(TRUNCATE_MARKER)[0];
  }
  return callback(null, finalContent);
};
