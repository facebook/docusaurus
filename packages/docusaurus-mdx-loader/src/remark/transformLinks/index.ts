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
import {assetRequireAttributeValue, transformNode} from '../utils';
import type {Plugin, Transformer} from 'unified';
import type {MdxJsxTextElement} from 'mdast-util-mdx';
import type {Parent} from 'unist';
import type {Link, Literal, Root} from 'mdast';

type PluginOptions = {
  staticDirs: string[];
  siteDir: string;
};

type Context = PluginOptions & {
  filePath: string;
  inlineMarkdownLinkFileLoader: string;
};

type Target = [node: Link, index: number, parent: Parent];

/**
 * Transforms the link node to a JSX `<a>` element with a `require()` call.
 */
async function toAssetRequireNode(
  [node]: Target,
  assetPath: string,
  context: Context,
) {
  // MdxJsxTextElement => see https://github.com/facebook/docusaurus/pull/8288#discussion_r1125871405
  const jsxNode = node as unknown as MdxJsxTextElement;
  const attributes: MdxJsxTextElement['attributes'] = [];

  // require("assets/file.pdf") means requiring from a package called assets
  const relativeAssetPath = `./${posixPath(
    path.relative(path.dirname(context.filePath), assetPath),
  )}`;

  const parsedUrl = parseURLOrPath(node.url);
  const hash = parsedUrl.hash ?? '';
  const search = parsedUrl.search ?? '';

  const requireString = `${
    // A hack to stop Webpack from using its built-in loader to parse JSON
    path.extname(relativeAssetPath) === '.json'
      ? `${relativeAssetPath.replace('.json', '.raw')}!=`
      : ''
  }${context.inlineMarkdownLinkFileLoader}${
    escapePath(relativeAssetPath) + search
  }`;

  attributes.push({
    type: 'mdxJsxAttribute',
    name: 'target',
    value: '_blank',
  });

  // Assets are not routes, and are required by Webpack already
  // They should not trigger the broken link checker
  attributes.push({
    type: 'mdxJsxAttribute',
    name: 'data-noBrokenLinkCheck',
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: 'true',
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'Literal',
                value: true,
                raw: 'true',
              },
            },
          ],
          sourceType: 'module',
          comments: [],
        },
      },
    },
  });

  attributes.push({
    type: 'mdxJsxAttribute',
    name: 'href',
    value: assetRequireAttributeValue(requireString, hash),
  });

  if (node.title) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'title',
      value: escapeHtml(node.title),
    });
  }

  const {children} = node;

  transformNode(jsxNode, {
    type: 'mdxJsxTextElement',
    name: 'a',
    attributes,
    children,
  });
}

async function ensureAssetFileExist(assetPath: string, sourceFilePath: string) {
  const assetExists = await fs.pathExists(assetPath);
  if (!assetExists) {
    throw new Error(
      `Asset ${toMessageRelativeFilePath(
        assetPath,
      )} used in ${toMessageRelativeFilePath(sourceFilePath)} not found.`,
    );
  }
}

async function getAssetAbsolutePath(
  assetPath: string,
  {siteDir, filePath, staticDirs}: Context,
) {
  if (assetPath.startsWith('@site/')) {
    const assetFilePath = path.join(siteDir, assetPath.replace('@site/', ''));
    // The @site alias is the only way to believe that the user wants an asset.
    // Everything else can just be a link URL
    await ensureAssetFileExist(assetFilePath, filePath);
    return assetFilePath;
  } else if (path.isAbsolute(assetPath)) {
    const assetFilePath = await findAsyncSequential(
      staticDirs.map((dir) => path.join(dir, assetPath)),
      fs.pathExists,
    );
    if (assetFilePath) {
      return assetFilePath;
    }
  } else {
    const assetFilePath = path.join(path.dirname(filePath), assetPath);
    if (await fs.pathExists(assetFilePath)) {
      return assetFilePath;
    }
  }
  return null;
}

async function processLinkNode(target: Target, context: Context) {
  const [node] = target;
  if (!node.url) {
    // Try to improve error feedback
    // see https://github.com/facebook/docusaurus/issues/3309#issuecomment-690371675
    const title =
      node.title ?? (node.children[0] as Literal | undefined)?.value ?? '?';
    const line = node.position?.start.line ?? '?';
    throw new Error(
      `Markdown link URL is mandatory in "${toMessageRelativeFilePath(
        context.filePath,
      )}" file (title: ${title}, line: ${line}).`,
    );
  }

  const parsedUrl = url.parse(node.url);
  if (parsedUrl.protocol || !parsedUrl.pathname) {
    // Don't process pathname:// here, it's used by the <Link> component
    return;
  }
  const hasSiteAlias = parsedUrl.pathname.startsWith('@site/');
  const hasAssetLikeExtension =
    path.extname(parsedUrl.pathname) &&
    !parsedUrl.pathname.match(/\.(?:mdx?|html)(?:#|$)/);
  if (!hasSiteAlias && !hasAssetLikeExtension) {
    return;
  }

  const assetPath = await getAssetAbsolutePath(
    decodeURIComponent(parsedUrl.pathname),
    context,
  );
  if (assetPath) {
    await toAssetRequireNode(target, assetPath, context);
  }
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
      inlineMarkdownLinkFileLoader:
        fileLoaderUtils.loaders.inlineMarkdownLinkFileLoader,
    };

    const promises: Promise<void>[] = [];
    visit(root, 'link', (node, index, parent) => {
      if (!parent || index === undefined) {
        return;
      }
      promises.push(processLinkNode([node, index, parent], context));
    });
    await Promise.all(promises);
  };
};

export default plugin;
