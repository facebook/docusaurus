/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const visit = require('unist-util-visit');
const path = require('path');
const url = require('url');
const fs = require('fs-extra');
const {getFileLoaderUtils} = require('@docusaurus/core/lib/webpack/utils');

const {
  loaders: {inlineMarkdownLinkFileLoader},
} = getFileLoaderUtils();

// Needed to throw errors with computer-agnostic path messages
// Absolute paths are too dependant of user FS
function toRelativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

async function ensureAssetFileExist(fileSystemAssetPath, sourceFilePath) {
  const assetExists = await fs.exists(fileSystemAssetPath);
  if (!assetExists) {
    throw new Error(
      `Asset ${toRelativePath(fileSystemAssetPath)} used in ${toRelativePath(
        sourceFilePath,
      )} not found.`,
    );
  }
}

// transform the link node to a jsx link with a require() call
function toAssetRequireNode({node, index, parent, filePath, requireAssetPath}) {
  let relativeRequireAssetPath = path.relative(
    path.dirname(filePath),
    requireAssetPath,
  );
  relativeRequireAssetPath = relativeRequireAssetPath.startsWith('.')
    ? relativeRequireAssetPath
    : `./${relativeRequireAssetPath}`;

  const hrefProp = `require('${inlineMarkdownLinkFileLoader}${relativeRequireAssetPath}').default`;

  node.type = 'jsx';

  node.value = `<a target="_blank" href={${hrefProp}} ${
    node.title ? `title={${node.title}}` : ''
  } >`;

  const linkText = (node.children[0] && node.children[0].value) || '';
  delete node.children;

  parent.children.splice(index + 1, 0, {
    type: 'text',
    value: linkText,
  });

  parent.children.splice(index + 2, 0, {type: 'jsx', value: '</a>'});
}

// If the link looks like an asset link, we'll link to the asset,
// and use a require("assetUrl") (using webpack url-loader/file-loader)
// instead of navigating to such link
async function convertToAssetLinkIfNeeded({
  node,
  index,
  parent,
  staticDir,
  filePath,
}) {
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
      index,
      parent,
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
    if (await fs.exists(fileSystemAssetPath)) {
      toAssetLinkNode(fileSystemAssetPath);
    }
  } else {
    const fileSystemAssetPath = path.join(path.dirname(filePath), assetPath);
    if (await fs.exists(fileSystemAssetPath)) {
      toAssetLinkNode(fileSystemAssetPath);
    }
  }
}

async function processLinkNode({node, index, parent, filePath, staticDir}) {
  if (!node.url) {
    throw new Error(
      `Markdown link url is mandatory. filePath=${toRelativePath(
        filePath,
      )}, title=${node.title}`,
    );
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol) {
    return;
  }

  await convertToAssetLinkIfNeeded({
    node,
    index,
    parent,
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
