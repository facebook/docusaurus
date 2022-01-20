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
  const date = title.match(/ \((.*)\)/)[1];
  return {
    title: title.replace(/ \(.*\)/, ''),
    content: `---
date: ${date}
toc_min_heading_level: 3
toc_max_heading_level: 5
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
