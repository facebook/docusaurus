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
} from '@docusaurus/utils';
import visit from 'unist-util-visit';
import path from 'path';
import url from 'url';
import fs from 'fs-extra';
import escapeHtml from 'escape-html';
import sizeOf from 'image-size';
import {promisify} from 'util';
import type {Transformer} from 'unified';
import type {Image, Literal} from 'mdast';
import logger from '@docusaurus/logger';

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

type PluginOptions = {
  staticDirs: string[];
  siteDir: string;
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
  } catch (err) {
    // Workaround for https://github.com/yarnpkg/berry/pull/3889#issuecomment-1034469784
    // TODO remove this check once fixed in Yarn PnP
    if (!process.versions.pnp) {
      logger.warn`The image at path=${imagePath} can't be read correctly. Please ensure it's a valid image.
${(err as Error).message}`;
    }
  }

  Object.keys(jsxNode).forEach(
    (key) => delete jsxNode[key as keyof typeof jsxNode],
  );

  (jsxNode as Literal).type = 'jsx';
  jsxNode.value = `<img ${alt}src={${src}}${title}${width}${height} />`;
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
  {siteDir, filePath, staticDirs}: Context,
) {
  if (imagePath.startsWith('@site/')) {
    const imageFilePath = path.join(siteDir, imagePath.replace('@site/', ''));
    await ensureImageFileExist(imageFilePath, filePath);
    return imageFilePath;
  } else if (path.isAbsolute(imagePath)) {
    // absolute paths are expected to exist in the static folder
    const possiblePaths = staticDirs.map((dir) => path.join(dir, imagePath));
    const imageFilePath = await findAsyncSequential(
      possiblePaths,
      fs.pathExists,
    );
    if (!imageFilePath) {
      throw new Error(
        `Image ${possiblePaths
          .map((p) => toMessageRelativeFilePath(p))
          .join(' or ')} used in ${toMessageRelativeFilePath(
          filePath,
        )} not found.`,
      );
    }
    return imageFilePath;
  }
  // relative paths are resolved against the source file's folder
  const imageFilePath = path.join(
    path.dirname(filePath),
    decodeURIComponent(imagePath),
  );
  await ensureImageFileExist(imageFilePath, filePath);
  return imageFilePath;
}

async function processImageNode(node: Image, context: Context) {
  if (!node.url) {
    throw new Error(
      `Markdown image URL is mandatory in "${toMessageRelativeFilePath(
        context.filePath,
      )}" file`,
    );
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol || !parsedUrl.pathname) {
    // pathname:// is an escape hatch, in case user does not want her images to
    // be converted to require calls going through webpack loader
    if (parsedUrl.protocol === 'pathname:') {
      node.url = node.url.replace('pathname://', '');
    }
    return;
  }

  // We try to convert image urls without protocol to images with require calls
  // going through webpack ensures that image assets exist at build time
  const imagePath = await getImageAbsolutePath(parsedUrl.pathname, context);
  await toImageRequireNode(node, imagePath, context.filePath);
}

export default function plugin(options: PluginOptions): Transformer {
  return async (root, vfile) => {
    const promises: Promise<void>[] = [];
    visit(root, 'image', (node: Image) => {
      promises.push(
        processImageNode(node, {...options, filePath: vfile.path!}),
      );
    });
    await Promise.all(promises);
  };
}
