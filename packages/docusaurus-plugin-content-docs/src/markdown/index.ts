/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {readFile} from 'fs-extra';
import {getOptions} from 'loader-utils';
import {loader} from 'webpack';
import linkify from './linkify';
import {docuHash, aliasedSitePath} from '@docusaurus/utils';

export = function(fileString: string) {
  const callback = this.async();
  const {
    dataDir,
    docsDir,
    siteDir,
    versionedDir,
    sourceToPermalink,
  } = getOptions(this);

  // Replace all markdown linking to correct url
  const linkifiedStr = linkify(
    fileString,
    this.resourcePath,
    docsDir,
    siteDir,
    sourceToPermalink,
    versionedDir,
  );

  // Read metadata & then embed it to this markdown content
  // Note that metadataPath must be the same/ in-sync as the path from createData
  const aliasedSource = aliasedSitePath(this.resourcePath, siteDir);
  const metadataPath = path.join(dataDir, `${docuHash(aliasedSource)}.json`);

  // Add metadataPath as dependency of this loader result so that we can recompile if metadata is changed
  this.addDependency(metadataPath);

  readFile(metadataPath, 'utf8', function(err, metadata) {
    if (err) return callback && callback(err);

    const metadataStr = `export const metadata = ${metadata}`;
    // We need to add two lines break so that mdx won't mistake it as part of previous paragraph
    callback && callback(null, linkifiedStr + '\n\n' + metadataStr);
  });
} as loader.Loader;
