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

async function ensureImageFileExist(imagePath, sourceFilePath) {
  const imageExists = await fs.exists(imagePath);
  if (!imageExists) {
    // Need to throw computer-agnostic error message to pass unit-tests
    const relativeImagePath = path.relative(process.cwd(), imagePath);
    const relativeSourceFilePath = path.relative(process.cwd(), sourceFilePath);
    throw new Error(
      `Image ${relativeImagePath} used in ${relativeSourceFilePath} not found.`,
    );
  }
}

async function processImageNode(node, {filePath, staticDir}) {
  if (!node.url) {
    throw new Error(`markdown image url is mandatory. filePath=${filePath}`);
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol) {
    // pathname:// is an escape hatch,
    // in case user does not want his images to be converted to require calls going through webpack loader
    // we don't have to document this for now,
    // it's mostly to make next release less risky (2.0.0-alpha.59)
    if (parsedUrl.protocol === 'pathname:') {
      node.url = node.url.replace('pathname://', '');
    } else {
      // noop
    }
  }
  // images without protocol
  else if (path.isAbsolute(node.url)) {
    // absolute paths are expected to exist in the static folder
    const expectedImagePath = path.join(staticDir, node.url);
    await ensureImageFileExist(expectedImagePath, filePath);
  }
  // We try to convert image urls without protocol to images with require calls
  // going through webpack ensures that image assets exist at build time
  else {
    // relative paths are resolved against the source file's folder
    const expectedImagePath = path.join(path.dirname(filePath), node.url);
    await ensureImageFileExist(expectedImagePath, filePath);

    node.type = 'jsx';
    node.value = `<img ${node.alt ? `alt={"${node.alt}"}` : ''} ${
      node.url
        ? `src={require("!url-loader!${
            node.url.startsWith('./') ? node.url : `./${node.url}`
          }").default}`
        : ''
    } ${node.title ? `title={"${node.title}"}` : ''} />`;

    if (node.url) {
      delete node.url;
    }
    if (node.alt) {
      delete node.alt;
    }
    if (node.title) {
      delete node.title;
    }
  }
}

const plugin = (options) => {
  const transformer = async (root) => {
    const promises = [];
    visit(root, 'image', (node) => {
      promises.push(processImageNode(node, options));
    });
    await Promise.all(promises);
  };
  return transformer;
};

module.exports = plugin;
