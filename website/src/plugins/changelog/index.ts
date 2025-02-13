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

export {validateOptions} from '@docusaurus/plugin-content-blog';

/**
 * Multiple versions may be published on the same day, causing the order to be
 * the reverse. Therefore, our publish time has a "fake hour" to order them.
 */
// TODO may leak small amount of memory in multi-locale builds
const publishTimes = new Set<string>();

type Author = {name: string; url: string; alias: string; imageURL: string};

type AuthorsMap = Record<string, Author>;

type ChangelogEntry = {
  title: string;
  content: string;
  authors: Author[];
};

function parseAuthor(committerLine: string): Author {
  const groups = committerLine.match(
    /- (?:(?<name>.*?) \()?\[@(?<alias>.*)\]\((?<url>.*?)\)\)?/,
  )!.groups as {name: string; alias: string; url: string};

  return {
    ...groups,
    name: groups.name ?? groups.alias,
    imageURL: `https://github.com/${groups.alias}.png`,
  };
}

function parseAuthors(content: string): Author[] {
  const committersContent = content.match(/## Committers: \d.*/s)?.[0];
  if (!committersContent) {
    return [];
  }
  const committersLines = committersContent.match(/- .*/g)!;

  const authors = committersLines
    .map(parseAuthor)
    .sort((a, b) => a.url.localeCompare(b.url));

  return authors;
}

function createAuthorsMap(changelogEntries: ChangelogEntry[]): AuthorsMap {
  const allAuthors = changelogEntries.flatMap((entry) => entry.authors);
  const authorsMap: AuthorsMap = {};
  allAuthors?.forEach((author) => {
    authorsMap[author.alias] = author;
  });
  return authorsMap;
}

function toChangelogEntry(sectionContent: string): ChangelogEntry | null {
  const title = sectionContent
    .match(/\n## .*/)?.[0]
    .trim()
    .replace('## ', '');
  if (!title) {
    return null;
  }
  const content = sectionContent
    .replace(/\n## .*/, '')
    .trim()
    .replace('running_woman', 'running');

  const authors = parseAuthors(content);

  let hour = 20;
  const date = title.match(/ \((?<date>.*)\)/)?.groups!.date;
  while (publishTimes.has(`${date}T${hour}:00`)) {
    hour -= 1;
  }
  publishTimes.add(`${date}T${hour}:00`);

  return {
    authors,
    title: title.replace(/ \(.*\)/, ''),
    content: `---
mdx:
 format: md
date: ${`${date}T${hour}:00`}${
      authors.length > 0
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

function toChangelogEntries(fileContent: string): ChangelogEntry[] {
  return fileContent
    .split(/(?=\n## )/)
    .map(toChangelogEntry)
    .filter((s): s is ChangelogEntry => s !== null);
}

async function createBlogFiles(
  generateDir: string,
  changelogEntries: ChangelogEntry[],
) {
  await Promise.all(
    changelogEntries.map((changelogEntry) =>
      fs.outputFile(
        path.join(generateDir, `${changelogEntry.title}.md`),
        changelogEntry.content,
      ),
    ),
  );

  await fs.outputFile(
    path.join(generateDir, 'authors.json'),
    JSON.stringify(createAuthorsMap(changelogEntries), null, 2),
  );
}

const ChangelogPlugin: typeof pluginContentBlog =
  async function ChangelogPlugin(context, options) {
    const generateDir = path.join(context.siteDir, 'changelog/source');
    const blogPlugin = await pluginContentBlog(context, {
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
        const changelogEntries = toChangelogEntries(fileContent);

        // We have to create intermediate files here
        // Unfortunately Docusaurus doesn't have yet any concept of virtual file
        await createBlogFiles(generateDir, changelogEntries);

        // Read the files we actually just wrote
        const content = (await blogPlugin.loadContent?.())!;

        content.blogPosts.forEach((post, index) => {
          const pageIndex = Math.floor(
            index / (options.postsPerPage as number),
          );
          // @ts-expect-error: TODO Docusaurus use interface declaration merging
          post.metadata.listPageLink = normalizeUrl([
            context.baseUrl,
            options.routeBasePath,
            pageIndex === 0 ? '/' : `/page/${pageIndex + 1}`,
          ]);
        });
        return content;
      },

      configureWebpack(...args) {
        const config = blogPlugin.configureWebpack?.(...args);
        const pluginDataDirRoot = path.join(
          context.generatedFilesDir,
          'changelog-plugin',
          'default',
        );
        // Redirect the metadata path to our folder
        // @ts-expect-error: unsafe but works
        const mdxLoader = config.module.rules[0].use[0];
        mdxLoader.options.metadataPath = (mdxPath: string) => {
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
  };

export default ChangelogPlugin;
