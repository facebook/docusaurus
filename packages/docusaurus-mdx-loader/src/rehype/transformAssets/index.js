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

// Needed to throw errors with computer-agnostic path messages
// Absolute paths are too dependant of user FS
function toRelativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

async function ensureAssetFileExist(assetPath, sourceFilePath) {
  const assetExists = await fs.exists(assetPath);
  if (!assetExists) {
    throw new Error(
      `Asset ${toRelativePath(assetPath)} used in ${toRelativePath(
        sourceFilePath,
      )} not found.`,
    );
  }
}

async function processLinkNode(node, index, parent, {filePath}) {
  if (!node.properties.href) {
    throw new Error(
      `Markdown link url is mandatory. filePath=${toRelativePath(filePath)}`,
    );
  }
  const parsedUrl = url.parse(node.properties.href);
  const assetPath = node.properties.href;
  if (parsedUrl.protocol) {
    // pathname:// is an escape hatch,
    // in case user does not want his assets to be converted to require calls going through webpack loader
    // we don't have to document this for now,
    // it's mostly to make next release less risky (2.0.0-alpha.59)
    if (parsedUrl.protocol === 'pathname:') {
      node.properties.href = node.properties.href.replace('pathname://', '');
    }
    return;
  }
  if (
    assetPath.match(/#|.md|.mdx/) ||
    path.isAbsolute(assetPath) ||
    !path.extname(assetPath) ||
    !assetPath.startsWith('.')
  ) {
    return;
  }

  const expectedAssetPath = path.join(path.dirname(filePath), assetPath);
  await ensureAssetFileExist(expectedAssetPath, filePath);

  node.type = 'jsx';
  node.value = `<a  target="_blank" ${
    assetPath ? `href={require('!file-loader!${assetPath}').default}` : ''
  } ${node.properties.title ? `title={${node.properties.title}}` : ''} >`;
  const {children} = node;
  delete node.children;
  if (children.length === 1) {
    parent.children.splice(index + 1, 0, children[0]);
  } else {
    parent.children.splice(index + 1, 0, {
      type: 'element',
      tagName: 'p',
      children,
    });
  }
  parent.children.splice(index + 2, 0, {type: 'jsx', value: '</a>'});
}

const plugin = (options) => {
  const transformer = async (root) => {
    const promises = [];
    visit(
      root,
      (node) => node.tagName === 'a',
      (node, index, parent) => {
        promises.push(processLinkNode(node, index, parent, options));
      },
    );
    await Promise.all(promises);
  };
  return transformer;
};

module.exports = plugin;
