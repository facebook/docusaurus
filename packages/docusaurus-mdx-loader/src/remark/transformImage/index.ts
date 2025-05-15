/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import url from 'url';
import fs from 'fs-extra';
import {
  toMessageRelativeFilePath,
  posixPath,
  escapePath,
  findAsyncSequential,
  getFileLoaderUtils,
  parseURLOrPath,
} from '@docusaurus/utils';
import escapeHtml from 'escape-html';
import {imageSizeFromFile} from 'image-size/fromFile';
import logger from '@docusaurus/logger';
import {assetRequireAttributeValue, transformNode} from '../utils';
import type {Plugin, Transformer} from 'unified';
import type {MdxJsxTextElement} from 'mdast-util-mdx';
import type {Image, Root} from 'mdast';
import type {Parent} from 'unist';

type PluginOptions = {
  staticDirs: string[];
  siteDir: string;
};

type Context = PluginOptions & {
  filePath: string;
  inlineMarkdownImageFileLoader: string;
};

type Target = [node: Image, index: number, parent: Parent];

async function toImageRequireNode(
  [node]: Target,
  imagePath: string,
  context: Context,
) {
  // MdxJsxTextElement => see https://github.com/facebook/docusaurus/pull/8288#discussion_r1125871405
  const jsxNode = node as unknown as MdxJsxTextElement;
  const attributes: MdxJsxTextElement['attributes'] = [];

  let relativeImagePath = posixPath(
    path.relative(path.dirname(context.filePath), imagePath),
  );
  relativeImagePath = `./${relativeImagePath}`;

  const parsedUrl = parseURLOrPath(node.url, 'https://example.com');
  const hash = parsedUrl.hash ?? '';
  const search = parsedUrl.search ?? '';
  const requireString = `${context.inlineMarkdownImageFileLoader}${
    escapePath(relativeImagePath) + search
  }`;
  if (node.alt) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'alt',
      value: escapeHtml(node.alt),
    });
  }

  attributes.push({
    type: 'mdxJsxAttribute',
    name: 'src',
    value: assetRequireAttributeValue(requireString, hash),
  });

  if (node.title) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'title',
      value: escapeHtml(node.title),
    });
  }

  try {
    const size = (await imageSizeFromFile(imagePath))!;
    if (size.width) {
      attributes.push({
        type: 'mdxJsxAttribute',
        name: 'width',
        value: String(size.width),
      });
    }
    if (size.height) {
      attributes.push({
        type: 'mdxJsxAttribute',
        name: 'height',
        value: String(size.height),
      });
    }
  } catch (err) {
    console.error(err);
    // Workaround for https://github.com/yarnpkg/berry/pull/3889#issuecomment-1034469784
    // TODO remove this check once fixed in Yarn PnP
    if (!process.versions.pnp) {
      logger.warn`The image at path=${imagePath} can't be read correctly. Please ensure it's a valid image.
${(err as Error).message}`;
    }
  }

  transformNode(jsxNode, {
    type: 'mdxJsxTextElement',
    name: 'img',
    attributes,
    children: [],
  });
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
    // Absolute paths are expected to exist in the static folder.
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
  const imageFilePath = path.join(path.dirname(filePath), imagePath);
  await ensureImageFileExist(imageFilePath, filePath);
  return imageFilePath;
}

async function processImageNode(target: Target, context: Context) {
  const [node] = target;
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

  // We decode it first because Node Url.pathname is always encoded
  // while the image file-system path are not.
  // See https://github.com/facebook/docusaurus/discussions/10720
  const decodedPathname = decodeURIComponent(parsedUrl.pathname);

  // We try to convert image urls without protocol to images with require calls
  // going through webpack ensures that image assets exist at build time
  const imagePath = await getImageAbsolutePath(decodedPathname, context);
  await toImageRequireNode(target, imagePath, context);
}

const plugin: Plugin<PluginOptions[], Root> = function plugin(
  options,
): Transformer<Root> {
  return async (root, vfile) => {
    const {visit} = await import('unist-util-visit');

    const fileLoaderUtils = getFileLoaderUtils(
      vfile.data.compilerName === 'server',
    );
    const context: Context = {
      ...options,
      filePath: vfile.path!,
      inlineMarkdownImageFileLoader:
        fileLoaderUtils.loaders.inlineMarkdownImageFileLoader,
    };

    const promises: Promise<void>[] = [];
    visit(root, 'image', (node, index, parent) => {
      if (!parent || index === undefined) {
        return;
      }
      promises.push(processImageNode([node, index, parent!], context));
    });
    await Promise.all(promises);
  };
};

export default plugin;
