/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {parse, normalizeUrl, posixPath} from '@docusaurus/utils';
import {LoadContext} from '@docusaurus/types';

import lastUpdate from './lastUpdate';
import {MetadataRaw, LastUpdateData, MetadataOptions, Env} from './types';

type Args = {
  source: string;
  refDir: string;
  context: LoadContext;
  options: MetadataOptions;
  env: Env;
};

async function lastUpdated(
  filePath: string,
  options: MetadataOptions,
): Promise<LastUpdateData> {
  const {showLastUpdateAuthor, showLastUpdateTime} = options;
  if (showLastUpdateAuthor || showLastUpdateTime) {
    // Use fake data in dev for faster development
    const fileLastUpdateData =
      process.env.NODE_ENV === 'production'
        ? await lastUpdate(filePath)
        : {
            author: 'Author',
            timestamp: 1539502055,
          };

    if (fileLastUpdateData) {
      const {author, timestamp} = fileLastUpdateData;
      return {
        lastUpdatedAt: showLastUpdateTime ? timestamp : undefined,
        lastUpdatedBy: showLastUpdateAuthor ? author : undefined,
      };
    }
  }
  return {};
}

export default async function processMetadata({
  source,
  refDir,
  context,
  options,
  env,
}: Args): Promise<MetadataRaw> {
  const {routeBasePath, editUrl} = options;
  const {siteDir, baseUrl} = context;
  const {versioning} = env;
  const filePath = path.join(refDir, source);

  const fileString = await fs.readFile(filePath, 'utf-8');
  const {frontMatter = {}, excerpt} = parse(fileString);

  // Default id is the file name.
  const baseID: string =
    frontMatter.id || path.basename(source, path.extname(source));
  if (baseID.includes('/')) {
    throw new Error('Document id cannot include "/".');
  }

  // Default title is the id.
  const title: string = frontMatter.title || baseID;

  const description: string = frontMatter.description || excerpt;

  let version;
  let id = baseID;

  // Append subdirectory as part of id.
  const dirName = path.dirname(source);
  if (dirName !== '.') {
    id = `${dirName}/${baseID}`;
  }

  if (versioning.enabled) {
    if (/^version-/.test(dirName)) {
      const inferredVersion = dirName
        .split('/', 1)
        .shift()!
        .replace(/^version-/, '');
      if (inferredVersion && versioning.versions.includes(inferredVersion)) {
        version = inferredVersion;
      }
    } else {
      version = 'next';
    }
  }

  // The version portion of the url path. Eg: 'next', '1.0.0', and ''
  const versionPath =
    version && version !== versioning.latestVersion ? version : '';

  // The last portion of the url path. Eg: 'foo/bar', 'bar'
  const routePath =
    version && version !== 'next'
      ? id.replace(new RegExp(`^version-${version}/`), '')
      : id;
  const permalink = normalizeUrl([
    baseUrl,
    routeBasePath,
    versionPath,
    routePath,
  ]);

  const {sidebar_label, custom_edit_url} = frontMatter;

  const relativePath = path.relative(siteDir, filePath);

  // Cannot use path.join() as it resolves '../' and removes the '@site'. Let webpack loader resolve it.
  const aliasedPath = `@site/${relativePath}`;

  const docsEditUrl = editUrl
    ? normalizeUrl([editUrl, posixPath(relativePath)])
    : undefined;

  const {lastUpdatedAt, lastUpdatedBy} = await lastUpdated(filePath, options);

  // Assign all of object properties during instantiation (if possible) for NodeJS optimization
  // Adding properties to object after instantiation will cause hidden class transitions.
  const metadata: MetadataRaw = {
    id,
    title,
    description,
    source: aliasedPath,
    permalink,
    editUrl: custom_edit_url || docsEditUrl,
    version,
    lastUpdatedBy,
    lastUpdatedAt,
    sidebar_label,
  };

  return metadata;
}
