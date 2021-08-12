/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import visit, {Visitor} from 'unist-util-visit';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';
import escapeHtml from 'escape-html';
import {getFileLoaderUtils} from '@docusaurus/core/lib/webpack/utils';
import {
  posixPath,
  escapePath,
  toMessageRelativeFilePath,
} from '@docusaurus/utils';
import type {Plugin, Transformer} from 'unified';
import type {Image} from 'mdast';

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

interface PluginOptions {
  filePath: string;
  staticDir: string;
}

const createJSX = (node: Image, pathUrl: string) => {
  const {url: _url, alt, title, ...strippedNode} = node;
  const jsxNode = {
    ...strippedNode,
    type: 'jsx',
    value: `<img ${node.alt ? `alt={"${escapeHtml(node.alt)}"} ` : ''}${
      node.url
        ? `src={require("${inlineMarkdownImageFileLoader}${escapePath(
            pathUrl,
          )}").default}`
        : ''
    }${node.title ? ` title="${escapeHtml(node.title)}"` : ''} />`,
  };
  return jsxNode;
};

async function ensureImageFileExist(imagePath: string, sourceFilePath: string) {
  const imageExists = await fs.pathExists(imagePath);
  if (!imageExists) {
    throw new Error(
      `Image ${toMessageRelativeFilePath(
        imagePath,
      )} used in ${toMessageRelativeFilePath(sourceFilePath)} not found.`,
    );
  }
}

async function processImageNode(
  node: Image,
  {filePath, staticDir}: PluginOptions,
) {
  if (!node.url) {
    throw new Error(
      `Markdown image URL is mandatory in "${toMessageRelativeFilePath(
        filePath,
      )}" file`,
    );
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
    createJSX(node, posixPath(expectedImagePath));
  }
  // We try to convert image urls without protocol to images with require calls
  // going through webpack ensures that image assets exist at build time
  else {
    // relative paths are resolved against the source file's folder
    const expectedImagePath = path.join(path.dirname(filePath), node.url);
    await ensureImageFileExist(expectedImagePath, filePath);
    createJSX(node, node.url.startsWith('./') ? node.url : `./${node.url}`);
  }
}

const plugin: Plugin<[PluginOptions]> = (options) => {
  const transformer: Transformer = async (root) => {
    const promises: Promise<void>[] = [];
    const visitor: Visitor<Image> = (node) => {
      promises.push(processImageNode(node, options));
    };
    visit(root, 'image', visitor);
    await Promise.all(promises);
  };
  return transformer;
};

export default plugin;
