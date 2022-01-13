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
import type {Plugin, Transformer} from 'unified';
import type {Image, Literal} from 'mdast';

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

interface PluginOptions {
  filePath: string;
  staticDirs: string[];
  siteDir: string;
}

function toImageRequireNode(node: Image, imagePath: string, filePath: string) {
  const jsxNode = node as Literal & Partial<Image>;
  let relativeImagePath = posixPath(
    path.relative(path.dirname(filePath), imagePath),
  );
  relativeImagePath = `./${relativeImagePath}`;

  const parsedUrl = url.parse(node.url);
  const hash = parsedUrl.hash ?? '';
  const search = parsedUrl.search ?? '';

  const alt = node.alt ? `alt={"${escapeHtml(node.alt)}"} ` : '';
  const src = `require("${inlineMarkdownImageFileLoader}${
    escapePath(relativeImagePath) + search
  }").default${hash ? ` + '${hash}'` : ''}`;
  const title = node.title ? ` title="${escapeHtml(node.title)}"` : '';

  Object.keys(jsxNode).forEach(
    (key) => delete jsxNode[key as keyof typeof jsxNode],
  );

  (jsxNode as Literal).type = 'jsx';
  jsxNode.value = `<img ${alt}src={${src}}${title} />`;
}

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

async function getImageAbsolutePath(
  imagePath: string,
  {siteDir, filePath, staticDirs}: PluginOptions,
) {
  if (imagePath.startsWith('@site/')) {
    const imageFilePath = path.join(siteDir, imagePath.replace('@site/', ''));
    await ensureImageFileExist(imageFilePath, filePath);
    return imageFilePath;
  } else if (path.isAbsolute(imagePath)) {
    // absolute paths are expected to exist in the static folder
    const possiblePaths = staticDirs.map((dir) => path.join(dir, imagePath));
    // eslint-disable-next-line no-restricted-syntax
    for (const possiblePath of possiblePaths) {
      const imageFilePath = possiblePath;
      if (await fs.pathExists(imageFilePath)) {
        return imageFilePath;
      }
    }
    throw new Error(
      `Image ${possiblePaths
        .map((p) => toMessageRelativeFilePath(p))
        .join(' or ')} used in ${toMessageRelativeFilePath(
        filePath,
      )} not found.`,
    );
  }
  // We try to convert image urls without protocol to images with require calls
  // going through webpack ensures that image assets exist at build time
  else {
    // relative paths are resolved against the source file's folder
    const imageFilePath = path.join(path.dirname(filePath), imagePath);
    await ensureImageFileExist(imageFilePath, filePath);
    return imageFilePath;
  }
}

async function processImageNode(node: Image, options: PluginOptions) {
  if (!node.url) {
    throw new Error(
      `Markdown image URL is mandatory in "${toMessageRelativeFilePath(
        options.filePath,
      )}" file`,
    );
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol || !parsedUrl.pathname) {
    // pathname:// is an escape hatch,
    // in case user does not want his images to be converted to require calls going through webpack loader
    // we don't have to document this for now,
    // it's mostly to make next release less risky (2.0.0-alpha.59)
    if (parsedUrl.protocol === 'pathname:') {
      node.url = node.url.replace('pathname://', '');
    }
    return;
  }

  const imagePath = await getImageAbsolutePath(parsedUrl.pathname, options);
  toImageRequireNode(node, imagePath, options.filePath);
}

const plugin: Plugin<[PluginOptions]> = (options) => {
  const transformer: Transformer = async (root) => {
    const promises: Promise<void>[] = [];
    visit(root, 'image', (node: Image) => {
      promises.push(processImageNode(node, options));
    });
    await Promise.all(promises);
  };
  return transformer;
};

export default plugin;
