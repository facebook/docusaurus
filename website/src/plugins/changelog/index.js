/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const fs = require('fs-extra');
const pluginContentBlog = require('@docusaurus/plugin-content-blog');
const {aliasedSitePath, docuHash} = require('@docusaurus/utils');

/**
 * Multiple versions may be published on the same day, causing the order to be
 * the reverse. Therefore, our publish time has a "fake hour" to order them.
 */
const publishTimes = new Set();
/**
 * We need to keep track of all committers that are in the changelog, and fetch
 * their avatars beforehand. This prevents sending too many requests to GitHub
 * every time one visits a page. This check is done in batches across each build.
 */
const allAuthors = new Set();

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

  let authors = content.match(/## Committers: \d+.*/ms);
  if (authors) {
    authors = authors[0]
      .match(/- .*/g)
      .map((line) =>
        line.match(/\[.*\]\((.*?)\)/)[1].replace('https//github.com/', ''),
      )
      .sort();

    authors.forEach((author) => allAuthors.add(author));
  }
  let hour = 20;
  const date = title.match(/ \((.*)\)/)[1];
  while (publishTimes.has(`${date}T${hour}:00`)) {
    hour -= 1;
  }
  publishTimes.add(`${date}T${hour}:00`);

  return {
    title: title.replace(/ \(.*\)/, ''),
    content: `---
date: ${`${date}T${hour}:00`}
toc_min_heading_level: 3
toc_max_heading_level: 5${
      authors
        ? `
authors:
${authors
  .map(
    (name) =>
      `  - image_url: ./img/${name}.png\n    url: https://github.com/${name}`,
  )
  .join('\n')}`
        : ''
    }
---

# ${title.replace(/ \(.*\)/, '')}

<!-- truncate -->

${content}`,
  };
}

/**
 * @param {import('@docusaurus/types').LoadContext} context
 * @returns {import('@docusaurus/types').Plugin}
 */
async function ChangelogPlugin(context, options) {
  const generateDir = path.join(
    context.generatedFilesDir,
    'changelog-plugin/source',
  );
  // These files are only written once in the lifecycle to avoid infinite refreshing
  const fileContent = await fs.readFile(
    path.join(__dirname, '../../../../CHANGELOG.md'),
    'utf-8',
  );
  const sections = fileContent
    .split(/(?=\n## )/ms)
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
  console.log(allAuthors);
  const blogPlugin = await pluginContentBlog.default(context, {
    ...options,
    path: generateDir,
    id: 'changelog',
    blogListComponent: '@theme/ChangelogList',
  });
  return {
    ...blogPlugin,
    name: 'changelog-plugin',
    // Avoid infinite refreshing, because we are writing to the temp folder
    getPathsToWatch() {
      return [];
    },
    configureWebpack(...args) {
      const config = blogPlugin.configureWebpack(...args);
      const pluginDataDirRoot = path.join(
        context.generatedFilesDir,
        'changelog-plugin',
        'default',
      );
      // Redirect the metadata path to our folder
      config.module.rules[0].use[1].options.metadataPath = (mdxPath) => {
        // Note that metadataPath must be the same/in-sync as
        // the path from createData for each MDX.
        const aliasedPath = aliasedSitePath(mdxPath, context.siteDir);
        return path.join(pluginDataDirRoot, `${docuHash(aliasedPath)}.json`);
      };
      return config;
    },
    getThemePath() {
      return path.join(__dirname, './theme');
    },
  };
}

ChangelogPlugin.validateOptions = (args) =>
  pluginContentBlog.validateOptions(args);

module.exports = ChangelogPlugin;
