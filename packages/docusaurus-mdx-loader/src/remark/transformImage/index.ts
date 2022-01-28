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
  findAsyncSequential,
  reportMessage,
} from '@docusaurus/utils';
import type {ReportingSeverity} from '@docusaurus/types';
import visit from 'unist-util-visit';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';
import escapeHtml from 'escape-html';
import sizeOf from 'image-size';
import {promisify} from 'util';
import type {Plugin, Transformer} from 'unified';
import type {Image, Literal} from 'mdast';
import logger from '@docusaurus/logger';

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

type PluginOptions = {
  staticDirs: string[];
  siteDir: string;
  onBrokenMarkdownAssets: ReportingSeverity;
};

type Context = PluginOptions & {
  filePath: string;
};

async function toImageRequireNode(
  node: Image,
  imagePath: string,
  filePath: string,
) {
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
  let width = '';
  let height = '';
  try {
    const size = (await promisify(sizeOf)(imagePath))!;
    if (size.width) {
      width = ` width="${size.width}"`;
    }
    if (size.height) {
      height = ` height="${size.height}"`;
    }
  } catch (e) {
    logger.error`The image at path=${imagePath} can't be read correctly. Please ensure it's a valid image.
${(e as Error).message}`;
  }

  Object.keys(jsxNode).forEach(
    (key) => delete jsxNode[key as keyof typeof jsxNode],
  );

  (jsxNode as Literal).type = 'jsx';
  jsxNode.value = `<img ${alt}src={${src}}${title}${width}${height} />`;
}

/**
 * If `onBrokenMarkdownAssets` is set to anything but `throw`, this function
 * may return `false` if the file doesn't exist
 */
async function imageFileExists(
  imagePath: string,
  sourceFilePath: string,
  onBrokenMarkdownAssets: ReportingSeverity,
): Promise<boolean> {
  const imageExists = await fs.pathExists(imagePath);
  if (!imageExists) {
    reportMessage(
      `Image ${toMessageRelativeFilePath(
        imagePath,
      )} used in ${toMessageRelativeFilePath(sourceFilePath)} not found.`,
      onBrokenMarkdownAssets,
    );
    return false;
  }
  return true;
}

/**
 * @returns `null` if image not found and `onBrokenMarkdownAssets` is anything
 * but `throw`
 */
async function getImageAbsolutePath(
  imagePath: string,
  {siteDir, filePath, staticDirs, onBrokenMarkdownAssets}: Context,
): Promise<string | null> {
  if (imagePath.startsWith('@site/')) {
    const imageFilePath = path.join(siteDir, imagePath.replace('@site/', ''));
    if (
      await imageFileExists(imageFilePath, filePath, onBrokenMarkdownAssets)
    ) {
      return imageFilePath;
    }
    return null;
  } else if (path.isAbsolute(imagePath)) {
    // absolute paths are expected to exist in the static folder
    const possiblePaths = staticDirs.map((dir) => path.join(dir, imagePath));
    const imageFilePath = await findAsyncSequential(
      possiblePaths,
      fs.pathExists,
    );
    if (!imageFilePath) {
      reportMessage(
        `Image ${possiblePaths
          .map((p) => toMessageRelativeFilePath(p))
          .join(' or ')} used in ${toMessageRelativeFilePath(
          filePath,
        )} not found.`,
        onBrokenMarkdownAssets,
      );
      return null;
    }
    return imageFilePath;
  }
  // We try to convert image urls without protocol to images with require calls
  // going through webpack ensures that image assets exist at build time
  else {
    // relative paths are resolved against the source file's folder
    const imageFilePath = path.join(path.dirname(filePath), imagePath);
    if (
      await imageFileExists(imageFilePath, filePath, onBrokenMarkdownAssets)
    ) {
      return imageFilePath;
    }
    return null;
  }
}

async function processImageNode(node: Image, context: Context) {
  if (!node.url) {
    reportMessage(
      `Markdown image URL is mandatory in "${toMessageRelativeFilePath(
        context.filePath,
      )}" file`,
      context.onBrokenMarkdownAssets,
    );
    return;
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

  const imagePath = await getImageAbsolutePath(parsedUrl.pathname, context);
  if (imagePath) {
    await toImageRequireNode(node, imagePath, context.filePath);
  }
}

const plugin: Plugin<[PluginOptions]> = (options) => {
  const transformer: Transformer = async (root, vfile) => {
    const promises: Promise<void>[] = [];
    visit(root, 'image', (node: Image) => {
      promises.push(
        processImageNode(node, {...options, filePath: vfile.path!}),
      );
    });
    await Promise.all(promises);
  };
  return transformer;
};

export default plugin;
