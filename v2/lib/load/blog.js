/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const path = require('path');
const fs = require('fs-extra');
const {parse, idx} = require('./utils');

function fileToUrl(fileName) {
  return fileName
    .replace('-', '/')
    .replace('-', '/')
    .replace('-', '/')
    .replace(/\.md$/, '');
}

async function loadBlog({blogDir, env, siteConfig}) {
  const blogFiles = await globby(['*.md'], {
    cwd: blogDir,
  });

  const {baseUrl} = siteConfig;

  /* Prepare metadata container */
  const blogMetadatas = [];

  /* the language for each blog page */
  const defaultLangTag = idx(env, ['translation', 'defaultLanguage', 'tag']);

  await Promise.all(
    blogFiles.map(async relativeSource => {
      const source = path.join(blogDir, relativeSource);

      const blogFileName = path.basename(relativeSource);
      // Extract, YYYY, MM, DD from the file name
      const filePathDateArr = blogFileName.split('-');
      const date = new Date(
        `${filePathDateArr[0]}-${filePathDateArr[1]}-${
          filePathDateArr[2]
        }T06:00:00.000Z`,
      );

      const fileString = await fs.readFile(source, 'utf-8');
      const {metadata: rawMetadata} = parse(fileString);
      const metadata = {
        permalink: path.join(baseUrl, `blog`, fileToUrl(blogFileName)),
        source,
        ...rawMetadata,
        date,
        language: defaultLangTag,
      };
      blogMetadatas.push(metadata);
    }),
  );
  blogMetadatas.sort((a, b) => a.date - b.date);

  // blogpage handling. Example: `/blog`, `/blog/page1`, `/blog/page2`
  const perPage = 10;
  const numOfBlog = blogMetadatas.length;
  const numberOfPage = Math.ceil(numOfBlog / perPage);
  const basePageUrl = path.join(baseUrl, 'blog');

  /* eslint-disable */
  for (let page = 0; page < numberOfPage; page++) {
    blogMetadatas.push({
      permalink: path.join(basePageUrl, `${page > 0 ? `page${page + 1}` : ''}`),
      language: defaultLangTag,
      isBlogPage: true,
      posts: blogMetadatas.slice(page * perPage, (page + 1) * perPage),
    });
  }

  return blogMetadatas;
}

module.exports = loadBlog;
