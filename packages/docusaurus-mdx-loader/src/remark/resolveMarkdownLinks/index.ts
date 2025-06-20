/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  parseLocalURLPath,
  serializeURLPath,
  type URLPath,
} from '@docusaurus/utils';
import logger from '@docusaurus/logger';
import type {Plugin, Transformer} from 'unified';
import type {Definition, Link, Root} from 'mdast';
import type {MarkdownConfig} from '@docusaurus/types';

type ResolveMarkdownLinkParams = {
  /**
   * Absolute path to the source file containing this Markdown link.
   */
  sourceFilePath: string;
  /**
   * The Markdown link pathname to resolve, as found in the source file.
   * If the link is "./myFile.mdx?qs#hash", this will be "./myFile.mdx"
   */
  linkPathname: string;
};

export type ResolveMarkdownLink = (
  params: ResolveMarkdownLinkParams,
) => string | null;

export interface PluginOptions {
  siteDir: string;
  resolveMarkdownLink: ResolveMarkdownLink;
  onBrokenMarkdownLinks: MarkdownConfig['hooks']['onBrokenMarkdownLinks'];
}

const HAS_MARKDOWN_EXTENSION = /\.mdx?$/i;

function parseMarkdownLinkURLPath(link: string): URLPath | null {
  const urlPath = parseLocalURLPath(link);

  // If it's not local, we don't resolve it even if it's a Markdown file
  // Example, we don't resolve https://github.com/project/README.md
  if (!urlPath) {
    return null;
  }

  // Ignore links without a Markdown file extension (ignoring qs/hash)
  if (!HAS_MARKDOWN_EXTENSION.test(urlPath.pathname)) {
    return null;
  }
  return urlPath;
}

/**
 * A remark plugin to extract the h1 heading found in Markdown files
 * This is exposed as "data.contentTitle" to the processed vfile
 * Also gives the ability to strip that content title (used for the blog plugin)
 */
const plugin: Plugin<PluginOptions[], Root> = function plugin(
  options,
): Transformer<Root> {
  const {resolveMarkdownLink, onBrokenMarkdownLinks, siteDir} = options;
  return async (root, file) => {
    const {visit} = await import('unist-util-visit');

    visit(root, ['link', 'definition'], (node) => {
      const link = node as unknown as Link | Definition;
      const linkURLPath = parseMarkdownLinkURLPath(link.url);
      if (!linkURLPath) {
        return;
      }

      const sourceFilePath = file.path;

      const permalink = resolveMarkdownLink({
        sourceFilePath,
        linkPathname: linkURLPath.pathname,
      });

      if (permalink === null) {
        logger.report(
          onBrokenMarkdownLinks,
        )`Markdown link couldn't be resolved: (url=${
          linkURLPath.pathname
        }) in source file path=${path.relative(siteDir, sourceFilePath)} `;
      }

      if (permalink) {
        // This reapplies the link ?qs#hash part to the resolved pathname
        link.url = serializeURLPath({
          ...linkURLPath,
          pathname: permalink,
        });
      }
    });
  };
};

export default plugin;
