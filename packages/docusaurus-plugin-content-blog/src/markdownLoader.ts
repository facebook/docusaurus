/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {parseQuery, getOptions} = require('loader-utils');
import {loader} from 'webpack';

export = function(fileString: string) {
  const callback = this.async();

  const {truncateMarker} = getOptions(this);

  let finalContent = fileString;

  // Truncate content if requested (e.g: file.md?truncated=true)
  const {truncated} = this.resourceQuery && parseQuery(this.resourceQuery);
  if (
    truncated &&
    (typeof truncateMarker === 'string'
      ? fileString.includes(truncateMarker)
      : truncateMarker.test(fileString))
  ) {
    // eslint-disable-next-line
    finalContent = fileString.split(truncateMarker)[0];
  }
  return callback && callback(null, finalContent);
} as loader.Loader;
