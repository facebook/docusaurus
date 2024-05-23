/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {stringifyContent} from '../utils';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {Link} from 'mdast';

export type ResolveMarkdownLink = ({
  link,
  filePath,
}: {
  link: string;
  filePath: string;
}) => string | undefined;

// TODO: this plugin shouldn't be in the core MDX loader
// After we allow plugins to provide Remark/Rehype plugins (see
// https://github.com/facebook/docusaurus/issues/6370), this should be provided
// by theme-mermaid itself
export interface PluginOptions {
  resolveMarkdownLink: ResolveMarkdownLink;
}

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// TODO upgrade to TS 5.3
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

const LINK_PATTERN = /\.mdx?$/g;

function ignoreLink(link: Link) {
  // Probably not 100% accurate, but this is faster than proper url parsing
  // Historical code, nobody complained about it so far
  const hasProtocol =
    link.url.toLowerCase().startsWith('http://') ||
    link.url.toLowerCase().startsWith('https://');
  return hasProtocol || !LINK_PATTERN.test(link.url);
}

export type BrokenMarkdownLink = {
  /** Absolute path to the file containing this link. */
  filePath: string;
  /**
   * The content of the link, like `"./brokenFile.md"`
   */
  link: Link;
};

/**
 * A remark plugin to extract the h1 heading found in Markdown files
 * This is exposed as "data.contentTitle" to the processed vfile
 * Also gives the ability to strip that content title (used for the blog plugin)
 */
const plugin: Plugin = function plugin(options: PluginOptions): Transformer {
  const {resolveMarkdownLink} = options;
  return async (root, file) => {
    const {toString} = await import('mdast-util-to-string');

    const {visit} = await import('unist-util-visit');

    const brokenMarkdownLinks: BrokenMarkdownLink[] = [];

    visit(root, 'link', (link: Link) => {
      if (ignoreLink(link)) {
        return;
      }
      const permalink = resolveMarkdownLink({
        link: link.url,
        filePath: file.path,
      });

      /*
            const sourcesToTry: string[] = [];
      // ./file.md and ../file.md are always relative to the current file
      if (!mdLink.startsWith('./') && !mdLink.startsWith('../')) {
        sourcesToTry.push(...getContentPathList(contentPaths), siteDir);
      }
      // /file.md is always relative to the content path
      if (!mdLink.startsWith('/')) {
        sourcesToTry.push(path.dirname(filePath));
      }

      const aliasedSourceMatch = sourcesToTry
        .map((p) => path.join(p, decodeURIComponent(mdLink)))
        .map((source) => aliasedSitePath(source, siteDir))
        .find((source) => sourceToPermalink[source]);

      const permalink: string | undefined = aliasedSourceMatch
        ? sourceToPermalink[aliasedSourceMatch]
        : undefined;

       */
      if (permalink) {
        console.log(`✅ Markdown link resolved: ${link.url} => ${permalink}`);
        link.url = permalink;
      } else {
        const linkContent = stringifyContent(link, toString);
        console.log(`❌ Markdown link broken: [${linkContent}](${link.url})`);
        brokenMarkdownLinks.push({
          filePath: file.path,
          link,
        });
      }
    });

    if (brokenMarkdownLinks.length > 0) {
      console.log(
        `❌ ${brokenMarkdownLinks.length} broken Markdown links for ${file.path}\n`,
      );
    }
  };
};

export default plugin;
