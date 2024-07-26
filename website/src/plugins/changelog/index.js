/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import pluginContentBlog from '@docusaurus/plugin-content-blog';
import {aliasedSitePath, docuHash, normalizeUrl} from '@docusaurus/utils';

/**
 * Multiple versions may be published on the same day, causing the order to be
 * the reverse. Therefore, our publish time has a "fake hour" to order them.
 */
const publishTimes = new Set();
/**
 * @type {Record<string, {name: string, url: string,alias: string, imageURL: string}>}
 */
const authorsMap = {};

/**
 * @param {string} section
 */
function processSection(section) {
  const title = section
    .match(/\n## .*/)?.[0]
    .trim()
    .replace('## ', '');
  if (!title) {
    return null;
  }
  const content = section
    .replace(/\n## .*/, '')
    .trim()
    .replace('running_woman', 'running');

  let authors = content.match(/## Committers: \d.*/s);
  if (authors) {
    authors = authors[0]
      .match(/- .*/g)
      .map(
        (line) =>
          line.match(
            /- (?:(?<name>.*?) \()?\[@(?<alias>.*)\]\((?<url>.*?)\)\)?/,
          ).groups,
      )
      .map((author) => ({
        ...author,
        name: author.name ?? author.alias,
        imageURL: `https://github.com/${author.alias}.png`,
      }))
      .sort((a, b) => a.url.localeCompare(b.url));

    authors.forEach((author) => {
      authorsMap[author.alias] = author;
    });
  }
  let hour = 20;
  const date = title.match(/ \((?<date>.*)\)/)?.groups.date;
  while (publishTimes.has(`${date}T${hour}:00`)) {
    hour -= 1;
  }
  publishTimes.add(`${date}T${hour}:00`);

  return {
    title: title.replace(/ \(.*\)/, ''),
    content: `---
mdx:
 format: md
date: ${`${date}T${hour}:00`}${
      authors
        ? `
authors:
${authors.map((author) => `  - '${author.alias}'`).join('\n')}`
        : ''
    }
---

# ${title.replace(/ \(.*\)/, '')}

<!-- truncate -->

${content.replace(/####/g, '##')}`,
  };
}

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @returns {import('@docusaurus/types').Plugin}
 */
export default async function ChangelogPlugin(context, options) {
  const generateDir = path.join(context.siteDir, 'changelog/source');
  const blogPlugin = await pluginContentBlog.default(context, {
    ...options,
    path: generateDir,
    id: 'changelog',
    blogListComponent: '@theme/ChangelogList',
    blogPostComponent: '@theme/ChangelogPage',
  });
  const changelogPath = path.join(__dirname, '../../../../CHANGELOG.md');
  return {
    ...blogPlugin,
    name: 'changelog-plugin',
    async loadContent() {
      const fileContent = await fs.readFile(changelogPath, 'utf-8');
      const sections = fileContent
        .split(/(?=\n## )/)
        .map(processSection)
        .filter(Boolean);
      await Promise.all(
        sections.map((section) =>
          fs.outputFile(
            path.join(generateDir, `${section.title}.md`),
            section.content,
          ),
        ),
      );
      const authorsPath = path.join(generateDir, 'authors.json');
      await fs.outputFile(authorsPath, JSON.stringify(authorsMap, null, 2));
      const content = await blogPlugin.loadContent();
      content.blogPosts.forEach((post, index) => {
        const pageIndex = Math.floor(index / options.postsPerPage);
        post.metadata.listPageLink = normalizeUrl([
          context.baseUrl,
          options.routeBasePath,
          pageIndex === 0 ? '/' : `/page/${pageIndex + 1}`,
        ]);
      });
      return content;
    },
    configureWebpack(...args) {
      const config = blogPlugin.configureWebpack(...args);
      const pluginDataDirRoot = path.join(
        context.generatedFilesDir,
        'changelog-plugin',
        'default',
      );
      // Redirect the metadata path to our folder
      const mdxLoader = config.module.rules[0].use[0];
      mdxLoader.options.metadataPath = (mdxPath) => {
        // Note that metadataPath must be the same/in-sync as
        // the path from createData for each MDX.
        const aliasedPath = aliasedSitePath(mdxPath, context.siteDir);
        return path.join(pluginDataDirRoot, `${docuHash(aliasedPath)}.json`);
      };
      return config;
    },
    getThemePath() {
      return './theme';
    },
    getPathsToWatch() {
      // Don't watch the generated dir
      return [changelogPath];
    },
  };
}

export const {validateOptions} = pluginContentBlog;
