/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');
const fs = require('fs-extra');
// TODO: Do not make it relative because plugins can be from node_modules.
const {parse, idx, normalizeUrl} = require('../lib/load/utils');

function fileToUrl(fileName) {
  return fileName
    .replace('-', '/')
    .replace('-', '/')
    .replace('-', '/')
    .replace(/\.md$/, '');
}

const DEFAULT_OPTIONS = {
  contentKey: 'blog',
  path: 'blog', // Path to data on filesystem.
  routeBasePath: 'blog', // URL Route.
  include: ['*.md'], // Extensions to include.
  pageCount: 10, // How many entries per page.
  cachePath: 'blogMetadata.js',
};

async function onLoadContent(opts, context) {
  const options = {...DEFAULT_OPTIONS, ...opts};

  const {env, siteConfig, siteDir} = context;
  const {pageCount, path: filePath, routeBasePath} = options;
  const blogDir = path.resolve(siteDir, filePath);
  const {baseUrl} = siteConfig;

  const blogFiles = await globby(options.include, {
    cwd: blogDir,
  });

  // Prepare metadata container.
  const blogMetadata = [];

  // Language for each blog page.
  const defaultLangTag = idx(env, ['translation', 'defaultLanguage', 'tag']);

  await Promise.all(
    blogFiles.map(async relativeSource => {
      const source = path.join(blogDir, relativeSource);

      const blogFileName = path.basename(relativeSource);
      // Extract, YYYY, MM, DD from the file name.
      const filePathDateArr = blogFileName.split('-');
      const date = new Date(
        `${filePathDateArr[0]}-${filePathDateArr[1]}-${
          filePathDateArr[2]
        }T06:00:00.000Z`,
      );

      const fileString = await fs.readFile(source, 'utf-8');
      const {metadata: rawMetadata} = parse(fileString);
      const metadata = {
        permalink: normalizeUrl([
          baseUrl,
          routeBasePath,
          fileToUrl(blogFileName),
        ]),
        source,
        ...rawMetadata,
        date,
        language: defaultLangTag,
      };
      blogMetadata.push(metadata);
    }),
  );
  blogMetadata.sort((a, b) => a.date - b.date);

  // Blog page handling. Example: `/blog`, `/blog/page1`, `/blog/page2`
  const numOfBlog = blogMetadata.length;
  const numberOfPage = Math.ceil(numOfBlog / pageCount);
  const basePageUrl = path.join(baseUrl, routeBasePath);

  // eslint-disable-next-line
  for (let page = 0; page < numberOfPage; page++) {
    blogMetadata.push({
      permalink: normalizeUrl([
        basePageUrl,
        `${page > 0 ? `page${page + 1}` : ''}`,
      ]),
      language: defaultLangTag,
      isBlogPage: true,
      posts: blogMetadata.slice(page * pageCount, (page + 1) * pageCount),
    });
  }

  return {
    contents: blogMetadata,
    options,
  };
}

module.exports = {
  onLoadContent,
};
