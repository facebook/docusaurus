/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {readFile} from 'fs-extra';
import mdx from '@mdx-js/mdx';
import chalk from 'chalk';
import emoji from 'remark-emoji';
import {
  parseFrontMatter,
  parseMarkdownContentTitle,
  escapePath,
  getFileLoaderUtils,
} from '@docusaurus/utils';
import stringifyObject from 'stringify-object';
import headings from './remark/headings';
import toc from './remark/toc';
import unwrapMdxCodeBlocks from './remark/unwrapMdxCodeBlocks';
import transformImage from './remark/transformImage';
import transformLinks from './remark/transformLinks';
import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';
import type {LoaderContext} from 'webpack';

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

const DEFAULT_OPTIONS: RemarkAndRehypePluginOptions = {
  rehypePlugins: [],
  remarkPlugins: [unwrapMdxCodeBlocks, emoji, headings, toc],
  beforeDefaultRemarkPlugins: [],
  beforeDefaultRehypePlugins: [],
};

type Options = RemarkAndRehypePluginOptions & {
  staticDirs: string[];
  siteDir: string;
  isMDXPartial?: (filePath: string) => boolean;
  isMDXPartialFrontMatterWarningDisabled?: boolean;
  removeContentTitle?: boolean;
  metadataPath?: string | ((filePath: string) => string);
  createAssets?: (metadata: {
    frontMatter: Record<string, unknown>;
    metadata: Record<string, unknown>;
  }) => Record<string, unknown>;
  filepath: string;
};

// When this throws, it generally means that there's no metadata file associated with this MDX document
// It can happen when using MDX partials (usually starting with _)
// That's why it's important to provide the "isMDXPartial" function in config
async function readMetadataPath(metadataPath: string) {
  try {
    return await readFile(metadataPath, 'utf8');
  } catch (e) {
    throw new Error(
      `MDX loader can't read MDX metadata file for path ${metadataPath}. Maybe the isMDXPartial option function was not provided?`,
    );
  }
}

// Converts assets an object with Webpack require calls code
// This is useful for mdx files to reference co-located assets using relative paths
// Those assets should enter the Webpack assets pipeline and be hashed
// For now, we only handle that for images and paths starting with ./
// {image: "./myImage.png"} => {image: require("./myImage.png")}
function createAssetsExportCode(assets: Record<string, unknown>) {
  if (Object.keys(assets).length === 0) {
    return 'undefined';
  }

  // TODO implementation can be completed/enhanced
  function createAssetValueCode(assetValue: unknown): string | undefined {
    if (Array.isArray(assetValue)) {
      const arrayItemCodes = assetValue.map(
        (item) => createAssetValueCode(item) ?? 'undefined',
      );
      return `[${arrayItemCodes.join(', ')}]`;
    }
    // Only process string values starting with ./
    // We could enhance this logic and check if file exists on disc?
    if (typeof assetValue === 'string' && assetValue.startsWith('./')) {
      // TODO do we have other use-cases than image assets?
      // Probably not worth adding more support, as we want to move to Webpack 5 new asset system (https://github.com/facebook/docusaurus/pull/4708)
      const inlineLoader = inlineMarkdownImageFileLoader;
      return `require("${inlineLoader}${escapePath(assetValue)}").default`;
    }
    return undefined;
  }

  const assetEntries = Object.entries(assets);

  const codeLines = assetEntries
    .map(([key, value]) => {
      const assetRequireCode = createAssetValueCode(value);
      return assetRequireCode ? `"${key}": ${assetRequireCode},` : undefined;
    })
    .filter(Boolean);

  return `{\n${codeLines.join('\n')}\n}`;
}

export default async function mdxLoader(
  this: LoaderContext<Options>,
  fileString: string,
): Promise<void> {
  const callback = this.async();
  const filePath = this.resourcePath;
  const reqOptions = this.getOptions() || {};

  const {frontMatter, content: contentWithTitle} = parseFrontMatter(fileString);

  const {content, contentTitle} = parseMarkdownContentTitle(contentWithTitle, {
    removeContentTitle: reqOptions.removeContentTitle,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  const options: Options = {
    ...reqOptions,
    remarkPlugins: [
      ...(reqOptions.beforeDefaultRemarkPlugins || []),
      ...DEFAULT_OPTIONS.remarkPlugins,
      [transformImage, {staticDirs: reqOptions.staticDirs, filePath}],
      [
        transformLinks,
        {
          staticDirs: reqOptions.staticDirs,
          filePath,
          siteDir: reqOptions.siteDir,
        },
      ],
      ...(reqOptions.remarkPlugins || []),
    ],
    rehypePlugins: [
      ...(reqOptions.beforeDefaultRehypePlugins || []),
      ...DEFAULT_OPTIONS.rehypePlugins,
      ...(reqOptions.rehypePlugins || []),
    ],
    filepath: filePath,
  };

  let result;
  try {
    result = await mdx(content, options);
  } catch (err) {
    return callback(err as Error);
  }

  // MDX partials are MDX files starting with _ or in a folder starting with _
  // Partial are not expected to have an associated metadata file or frontmatter
  const isMDXPartial = options.isMDXPartial && options.isMDXPartial(filePath);
  if (isMDXPartial && hasFrontMatter) {
    const errorMessage = `Docusaurus MDX partial files should not contain FrontMatter.
Those partial files use the _ prefix as a convention by default, but this is configurable.
File at ${filePath} contains FrontMatter that will be ignored:
${JSON.stringify(frontMatter, null, 2)}`;

    if (!options.isMDXPartialFrontMatterWarningDisabled) {
      const shouldError = process.env.NODE_ENV === 'test' || process.env.CI;
      if (shouldError) {
        return callback(new Error(errorMessage));
      } else {
        console.warn(chalk.yellow(errorMessage));
      }
    }
  }

  function getMetadataPath(): string | undefined {
    if (!isMDXPartial) {
      // Read metadata for this MDX and export it.
      if (options.metadataPath && typeof options.metadataPath === 'function') {
        return options.metadataPath(filePath);
      }
    }
    return undefined;
  }

  const metadataPath = getMetadataPath();
  if (metadataPath) {
    this.addDependency(metadataPath);
  }

  const metadataJsonString = metadataPath
    ? await readMetadataPath(metadataPath)
    : undefined;

  const metadata = metadataJsonString
    ? JSON.parse(metadataJsonString)
    : undefined;

  const assets =
    reqOptions.createAssets && metadata
      ? reqOptions.createAssets({frontMatter, metadata})
      : undefined;

  const exportsCode = `
export const frontMatter = ${stringifyObject(frontMatter)};
export const contentTitle = ${stringifyObject(contentTitle)};
${metadataJsonString ? `export const metadata = ${metadataJsonString};` : ''}
${assets ? `export const assets = ${createAssetsExportCode(assets)};` : ''}
`;

  const code = `
import React from 'react';
import { mdx } from '@mdx-js/react';

${exportsCode}
${result}
`;

  return callback(null, code);
}
