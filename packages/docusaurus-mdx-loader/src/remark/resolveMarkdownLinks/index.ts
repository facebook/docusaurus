/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  parseLocalURLPath,
  serializeURLPath,
  type URLPath,
} from '@docusaurus/utils';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Transformer} from 'unified';
import type {Definition, Link} from 'mdast';

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
  resolveMarkdownLink: ResolveMarkdownLink;
}

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// TODO upgrade to TS 5.3
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
// import type {Plugin} from 'unified';
type Plugin = any; // TODO fix this asap

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
const plugin: Plugin = function plugin(options: PluginOptions): Transformer {
  const {resolveMarkdownLink} = options;
  return async (root, file) => {
    const {visit} = await import('unist-util-visit');

    visit(root, ['link', 'definition'], (node) => {
      const link = node as unknown as Link | Definition;
      const linkURLPath = parseMarkdownLinkURLPath(link.url);
      if (!linkURLPath) {
        return;
      }

      const permalink = resolveMarkdownLink({
        sourceFilePath: file.path,
        linkPathname: linkURLPath.pathname,
      });

      if (permalink) {
        // This reapplies the link ?qs#hash part to the resolved pathname
        const resolvedUrl = serializeURLPath({
          ...linkURLPath,
          pathname: permalink,
        });
        link.url = resolvedUrl;
      }
    });
  };
};

export default plugin;
