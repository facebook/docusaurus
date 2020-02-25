/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {parseQuery, getOptions} = require('loader-utils');
import {loader} from 'webpack';
import {truncate} from './blogUtils';

export = function(fileString: string) {
  const callback = this.async();

  const {truncateMarker}: {truncateMarker: RegExp} = getOptions(this);

  let finalContent = fileString;

  // Truncate content if requested (e.g: file.md?truncated=true).
  const {truncated} = this.resourceQuery && parseQuery(this.resourceQuery);
  if (truncated) {
    finalContent = truncate(fileString, truncateMarker);
  }

  return callback && callback(null, finalContent);
} as loader.Loader;
