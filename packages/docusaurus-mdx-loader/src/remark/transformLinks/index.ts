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
import logger from '@docusaurus/logger';
import {
  assetRequireAttributeValue,
  formatNodePositionExtraMessage,
  transformNode,
} from '../utils';
import type {Plugin, Transformer} from 'unified';
import type {MdxJsxTextElement} from 'mdast-util-mdx';
import type {Parent} from 'unist';
import type {Link, Root} from 'mdast';
import type {
  MarkdownConfig,
  OnBrokenMarkdownLinksFunction,
} from '@docusaurus/types';

export type PluginOptions = {
  staticDirs: string[];
  siteDir: string;
  onBrokenMarkdownLinks: MarkdownConfig['hooks']['onBrokenMarkdownLinks'];
};

type Context = PluginOptions & {
  staticDirs: string[];
  siteDir: string;
  onBrokenMarkdownLinks: OnBrokenMarkdownLinksFunction;
  filePath: string;
  inlineMarkdownLinkFileLoader: string;
};

type Target = [node: Link, index: number, parent: Parent];

function asFunction(
  onBrokenMarkdownLinks: PluginOptions['onBrokenMarkdownLinks'],
): OnBrokenMarkdownLinksFunction {
  if (typeof onBrokenMarkdownLinks === 'string') {
    const extraHelp =
      onBrokenMarkdownLinks === 'throw'
        ? logger.interpolate`\nTo ignore this error, use the code=${'siteConfig.markdown.hooks.onBrokenMarkdownLinks'} option, or apply the code=${'pathname://'} protocol to the broken link URLs.`
        : '';

    return ({sourceFilePath, url: linkUrl, node}) => {
      const relativePath = toMessageRelativeFilePath(sourceFilePath);
      if (linkUrl) {
        logger.report(
          onBrokenMarkdownLinks,
        )`Markdown link with URL code=${linkUrl} in source file path=${relativePath}${formatNodePositionExtraMessage(
          node,
        )} couldn't be resolved.
Make sure it references a local Markdown file that exists within the current plugin.${extraHelp}`;
      } else {
        logger.report(
          onBrokenMarkdownLinks,
        )`Markdown link with empty URL found in source file path=${relativePath}${formatNodePositionExtraMessage(
          node,
        )}.${extraHelp}`;
      }
    };
  } else {
    return (params) =>
      onBrokenMarkdownLinks({
        ...params,
        sourceFilePath: toMessageRelativeFilePath(params.sourceFilePath),
      });
  }
}

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

async function getLocalFileAbsolutePath(
  assetPath: string,
  {siteDir, filePath, staticDirs}: Context,
) {
  if (assetPath.startsWith('@site/')) {
    const assetFilePath = path.join(siteDir, assetPath.replace('@site/', ''));
    if (await fs.pathExists(assetFilePath)) {
      return assetFilePath;
    }
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
    node.url =
      context.onBrokenMarkdownLinks({
        url: node.url,
        sourceFilePath: context.filePath,
        node,
      }) ?? node.url;
    return;
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

  const localFilePath = await getLocalFileAbsolutePath(
    decodeURIComponent(parsedUrl.pathname),
    context,
  );

  if (localFilePath) {
    await toAssetRequireNode(target, localFilePath, context);
  } else {
    // The @site alias is the only way to believe that the user wants an asset.
    if (hasSiteAlias) {
      node.url =
        context.onBrokenMarkdownLinks({
          url: node.url,
          sourceFilePath: context.filePath,
          node,
        }) ?? node.url;
    } else {
      // Even if the url has a dot, and it looks like a file extension
      // it can be risky to throw and fail fast by default
      // It's perfectly valid for a route path segment to look like a filename
    }
  }
}

const plugin: Plugin<PluginOptions[], Root> = function plugin(
  options,
): Transformer<Root> {
  const onBrokenMarkdownLinks = asFunction(options.onBrokenMarkdownLinks);

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
      onBrokenMarkdownLinks,
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
