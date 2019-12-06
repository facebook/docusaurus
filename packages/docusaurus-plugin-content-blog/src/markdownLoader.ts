/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {parseQuery, getOptions} = require('loader-utils');
import {loader} from 'webpack';
import {truncate} from './blogUtils';
import path from 'path';
import {readFile} from 'fs-extra';
import {aliasedSitePath, docuHash} from '@docusaurus/utils';

export = function(fileString: string) {
  const callback = this.async();

  const {truncateMarker, siteDir, dataDir} = getOptions(this);

  let finalContent = fileString;

  // Truncate content if requested (e.g: file.md?truncated=true)
  const {truncated} = this.resourceQuery && parseQuery(this.resourceQuery);
  if (truncated) {
    finalContent = truncate(fileString, truncateMarker);
  }

  // Read metadata & then embed it to this markdown content
  // Note that metadataPath must be the same/ in-sync as the path from createData
  const aliasedSource = aliasedSitePath(this.resourcePath, siteDir);
  const metadataPath = path.join(dataDir, `${docuHash(aliasedSource)}.json`);

  // Add metadataPath as dependency of this loader result so that we can recompile if metadata is changed
  this.addDependency(metadataPath);

  readFile(metadataPath, 'utf8', function(err, metadata) {
    if (err) return callback && callback(err);

    const metadataStr = `export const metadata = ${metadata};`;
    callback && callback(null, finalContent + '\n' + metadataStr);
  });
} as loader.Loader;
