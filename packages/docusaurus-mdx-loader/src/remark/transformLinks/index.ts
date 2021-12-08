/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  toMessageRelativeFilePath,
  posixPath,
  escapePath,
  getFileLoaderUtils,
} from '@docusaurus/utils';
import visit from 'unist-util-visit';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';
import escapeHtml from 'escape-html';
import {stringifyContent} from '../utils';
import type {Plugin, Transformer} from 'unified';
import type {Link, Literal} from 'mdast';

const {
  loaders: {inlineMarkdownLinkFileLoader},
} = getFileLoaderUtils();
const hashRegex = /#.*$/;

interface PluginOptions {
  filePath: string;
  staticDirs: string[];
  siteDir: string;
}

async function ensureAssetFileExist(
  fileSystemAssetPath: string,
  sourceFilePath: string,
) {
  const assetExists = await fs.pathExists(fileSystemAssetPath);
  if (!assetExists) {
    throw new Error(
      `Asset ${toMessageRelativeFilePath(
        fileSystemAssetPath,
      )} used in ${toMessageRelativeFilePath(sourceFilePath)} not found.`,
    );
  }
}

// transform the link node to a jsx link with a require() call
function toAssetRequireNode({
  node,
  filePath,
  requireAssetPath,
}: {
  node: Link;
  filePath: string;
  requireAssetPath: string;
}) {
  let relativeRequireAssetPath = posixPath(
    path.relative(path.dirname(filePath), requireAssetPath),
  );
  const hash = hashRegex.test(node.url)
    ? node.url.substr(node.url.indexOf('#'))
    : '';

  // nodejs does not like require("assets/file.pdf")
  relativeRequireAssetPath = relativeRequireAssetPath.startsWith('.')
    ? relativeRequireAssetPath
    : `./${relativeRequireAssetPath}`;

  const href = `require('${inlineMarkdownLinkFileLoader}${escapePath(
    relativeRequireAssetPath,
  )}').default${hash ? ` + '${hash}'` : ''}`;
  const children = stringifyContent(node);
  const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';

  (node as unknown as Literal).type = 'jsx';
  (
    node as unknown as Literal
  ).value = `<a target="_blank" href={${href}}${title}>${children}</a>`;
}

// If the link looks like an asset link, we'll link to the asset,
// and use a require("assetUrl") (using webpack url-loader/file-loader)
// instead of navigating to such link
async function convertToAssetLinkIfNeeded(
  node: Link,
  {filePath, siteDir, staticDirs}: PluginOptions,
) {
  const assetPath = node.url.replace(hashRegex, '');

  const hasSiteAlias = assetPath.startsWith('@site/');
  const hasAssetLikeExtension =
    path.extname(assetPath) && !assetPath.match(/#|.md|.mdx|.html/);

  const looksLikeAssetLink = hasSiteAlias || hasAssetLikeExtension;

  if (!looksLikeAssetLink) {
    return;
  }

  function toAssetLinkNode(requireAssetPath: string) {
    toAssetRequireNode({
      node,
      filePath,
      requireAssetPath,
    });
  }

  if (assetPath.startsWith('@site/')) {
    const fileSystemAssetPath = path.join(
      siteDir,
      assetPath.replace('@site/', ''),
    );
    await ensureAssetFileExist(fileSystemAssetPath, filePath);
    toAssetLinkNode(fileSystemAssetPath);
  } else if (path.isAbsolute(assetPath)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const staticDir of staticDirs) {
      const fileSystemAssetPath = path.join(staticDir, assetPath);
      if (await fs.pathExists(fileSystemAssetPath)) {
        toAssetLinkNode(fileSystemAssetPath);
        return;
      }
    }
  } else {
    const fileSystemAssetPath = path.join(path.dirname(filePath), assetPath);
    if (await fs.pathExists(fileSystemAssetPath)) {
      toAssetLinkNode(fileSystemAssetPath);
    }
  }
}

async function processLinkNode(node: Link, options: PluginOptions) {
  if (!node.url) {
    // try to improve error feedback
    // see https://github.com/facebook/docusaurus/issues/3309#issuecomment-690371675
    const title = node.title || (node.children[0] as Literal)?.value || '?';
    const line = node?.position?.start?.line || '?';
    throw new Error(
      `Markdown link URL is mandatory in "${toMessageRelativeFilePath(
        options.filePath,
      )}" file (title: ${title}, line: ${line}).`,
    );
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol) {
    return;
  }

  await convertToAssetLinkIfNeeded(node, options);
}

const plugin: Plugin<[PluginOptions]> = (options) => {
  const transformer: Transformer = async (root) => {
    const promises: Promise<void>[] = [];
    visit(root, 'link', (node: Link) => {
      promises.push(processLinkNode(node, options));
    });
    await Promise.all(promises);
  };
  return transformer;
};

export default plugin;
