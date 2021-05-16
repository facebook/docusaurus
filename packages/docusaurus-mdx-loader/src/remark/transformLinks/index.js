/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {
  toMessageRelativeFilePath,
  posixPath,
  escapePath,
} = require('@docusaurus/utils');

const visit = require('unist-util-visit');
const path = require('path');
const url = require('url');
const fs = require('fs-extra');
const escapeHtml = require('escape-html');
const {toValue} = require('../utils');
const {getFileLoaderUtils} = require('@docusaurus/core/lib/webpack/utils');

const {
  loaders: {inlineMarkdownLinkFileLoader},
} = getFileLoaderUtils();

async function ensureAssetFileExist(fileSystemAssetPath, sourceFilePath) {
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
function toAssetRequireNode({node, filePath, requireAssetPath}) {
  /* eslint-disable no-param-reassign */

  let relativeRequireAssetPath = posixPath(
    path.relative(path.dirname(filePath), requireAssetPath),
  );

  // nodejs does not like require("assets/file.pdf")
  relativeRequireAssetPath = relativeRequireAssetPath.startsWith('.')
    ? relativeRequireAssetPath
    : `./${relativeRequireAssetPath}`;

  const href = `require('${inlineMarkdownLinkFileLoader}${escapePath(
    relativeRequireAssetPath,
  )}').default`;
  const children = (node.children || []).map((n) => toValue(n)).join('');
  const title = node.title ? `title="${escapeHtml(node.title)}"` : '';

  node.type = 'jsx';
  node.value = `<a target="_blank" href={${href}}${title}>${children}</a>`;
}

// If the link looks like an asset link, we'll link to the asset,
// and use a require("assetUrl") (using webpack url-loader/file-loader)
// instead of navigating to such link
async function convertToAssetLinkIfNeeded({node, staticDir, filePath}) {
  const assetPath = node.url;

  const hasSiteAlias = assetPath.startsWith('@site/');
  const hasAssetLikeExtension =
    path.extname(assetPath) && !assetPath.match(/#|.md|.mdx|.html/);

  const looksLikeAssetLink = hasSiteAlias || hasAssetLikeExtension;

  if (!looksLikeAssetLink) {
    return;
  }

  function toAssetLinkNode(requireAssetPath) {
    toAssetRequireNode({
      node,
      filePath,
      requireAssetPath,
    });
  }

  if (assetPath.startsWith('@site/')) {
    const siteDir = path.join(staticDir, '..');
    const fileSystemAssetPath = path.join(
      siteDir,
      assetPath.replace('@site/', ''),
    );
    await ensureAssetFileExist(fileSystemAssetPath, filePath);
    toAssetLinkNode(fileSystemAssetPath);
  } else if (path.isAbsolute(assetPath)) {
    const fileSystemAssetPath = path.join(staticDir, assetPath);
    if (await fs.pathExists(fileSystemAssetPath)) {
      toAssetLinkNode(fileSystemAssetPath);
    }
  } else {
    const fileSystemAssetPath = path.join(path.dirname(filePath), assetPath);
    if (await fs.pathExists(fileSystemAssetPath)) {
      toAssetLinkNode(fileSystemAssetPath);
    }
  }
}

async function processLinkNode({node, _index, _parent, filePath, staticDir}) {
  if (!node.url) {
    // try to improve error feedback
    // see https://github.com/facebook/docusaurus/issues/3309#issuecomment-690371675
    const title =
      node.title || (node.children[0] && node.children[0].value) || '?';
    const line =
      (node.position && node.position.start && node.position.start.line) || '?';
    throw new Error(
      `Markdown link url is mandatory. filePath=${toMessageRelativeFilePath(
        filePath,
      )}, title=${title}, line=${line}`,
    );
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol) {
    return;
  }

  await convertToAssetLinkIfNeeded({
    node,
    staticDir,
    filePath,
  });
}

const plugin = (options) => {
  const transformer = async (root) => {
    const promises = [];
    visit(root, 'link', (node, index, parent) => {
      promises.push(processLinkNode({node, index, parent, ...options}));
    });
    await Promise.all(promises);
  };
  return transformer;
};

module.exports = plugin;
