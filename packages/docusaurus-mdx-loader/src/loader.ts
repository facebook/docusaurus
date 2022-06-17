/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {
  parseFrontMatter,
  parseMarkdownContentTitle,
  escapePath,
  getFileLoaderUtils,
} from '@docusaurus/utils';
import {createCompiler} from '@mdx-js/mdx';
import emoji from 'remark-emoji';
import stringifyObject from 'stringify-object';

import headings from './remark/headings';
import toc from './remark/toc';
import unwrapMdxCodeBlocks from './remark/unwrapMdxCodeBlocks';
import transformImage from './remark/transformImage';
import transformLinks from './remark/transformLinks';

import transformAdmonitions from './remark/admonitions';
import type {LoaderContext} from 'webpack';
import type {Processor, Plugin} from 'unified';
import type {AdmonitionOptions} from './remark/admonitions';

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

const pragma = `
/* @jsxRuntime classic */
/* @jsx mdx */
/* @jsxFrag React.Fragment */
`;

const DEFAULT_OPTIONS: MDXOptions = {
  admonitions: true,
  rehypePlugins: [],
  remarkPlugins: [unwrapMdxCodeBlocks, emoji, headings, toc],
  beforeDefaultRemarkPlugins: [],
  beforeDefaultRehypePlugins: [],
};

const compilerCache = new Map<string | Options, [Processor, Options]>();

export type MDXPlugin =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Plugin<any[]>, any] | Plugin<any[]>;

export type MDXOptions = {
  admonitions: boolean | AdmonitionOptions;
  remarkPlugins: MDXPlugin[];
  rehypePlugins: MDXPlugin[];
  beforeDefaultRemarkPlugins: MDXPlugin[];
  beforeDefaultRehypePlugins: MDXPlugin[];
};

export type Options = Partial<MDXOptions> & {
  staticDirs: string[];
  siteDir: string;
  isMDXPartial?: (filePath: string) => boolean;
  isMDXPartialFrontMatterWarningDisabled?: boolean;
  removeContentTitle?: boolean;
  metadataPath?: string | ((filePath: string) => string);
  createAssets?: (metadata: {
    frontMatter: {[key: string]: unknown};
    metadata: {[key: string]: unknown};
  }) => {[key: string]: unknown};
  filepath: string;
};

/**
 * When this throws, it generally means that there's no metadata file associated
 * with this MDX document. It can happen when using MDX partials (usually
 * starting with _). That's why it's important to provide the `isMDXPartial`
 * function in config
 */
async function readMetadataPath(metadataPath: string) {
  try {
    return await fs.readFile(metadataPath, 'utf8');
  } catch (err) {
    logger.error`MDX loader can't read MDX metadata file path=${metadataPath}. Maybe the isMDXPartial option function was not provided?`;
    throw err;
  }
}

/**
 * Converts assets an object with Webpack require calls code.
 * This is useful for mdx files to reference co-located assets using relative
 * paths. Those assets should enter the Webpack assets pipeline and be hashed.
 * For now, we only handle that for images and paths starting with `./`:
 *
 * `{image: "./myImage.png"}` => `{image: require("./myImage.png")}`
 */
function createAssetsExportCode(assets: unknown) {
  if (
    typeof assets !== 'object' ||
    !assets ||
    Object.keys(assets).length === 0
  ) {
    return 'undefined';
  }

  // TODO implementation can be completed/enhanced
  function createAssetValueCode(assetValue: unknown): string | undefined {
    if (Array.isArray(assetValue)) {
      const arrayItemCodes = assetValue.map(
        (item: unknown) => createAssetValueCode(item) ?? 'undefined',
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
    .map(([key, value]: [string, unknown]) => {
      const assetRequireCode = createAssetValueCode(value);
      return assetRequireCode ? `"${key}": ${assetRequireCode},` : undefined;
    })
    .filter(Boolean);

  return `{\n${codeLines.join('\n')}\n}`;
}

function getAdmonitionsPlugins(
  admonitionsOption: MDXOptions['admonitions'],
): MDXPlugin[] {
  if (admonitionsOption) {
    const plugin: MDXPlugin =
      admonitionsOption === true
        ? transformAdmonitions
        : [transformAdmonitions, admonitionsOption];
    return [plugin];
  }
  return [];
}

export async function mdxLoader(
  this: LoaderContext<Options>,
  fileString: string,
): Promise<void> {
  const callback = this.async();
  const filePath = this.resourcePath;
  const reqOptions = this.getOptions();

  const {frontMatter, content: contentWithTitle} = parseFrontMatter(fileString);

  const {content, contentTitle} = parseMarkdownContentTitle(contentWithTitle, {
    removeContentTitle: reqOptions.removeContentTitle,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  if (!compilerCache.has(this.query)) {
    const remarkPlugins: MDXPlugin[] = [
      ...(reqOptions.beforeDefaultRemarkPlugins ?? []),
      ...getAdmonitionsPlugins(reqOptions.admonitions ?? false),
      ...DEFAULT_OPTIONS.remarkPlugins,
      [
        transformImage,
        {
          staticDirs: reqOptions.staticDirs,
          siteDir: reqOptions.siteDir,
        },
      ],
      [
        transformLinks,
        {
          staticDirs: reqOptions.staticDirs,
          siteDir: reqOptions.siteDir,
        },
      ],
      ...(reqOptions.remarkPlugins ?? []),
    ];

    const rehypePlugins: MDXPlugin[] = [
      ...(reqOptions.beforeDefaultRehypePlugins ?? []),
      ...DEFAULT_OPTIONS.rehypePlugins,
      ...(reqOptions.rehypePlugins ?? []),
    ];

    const options: Options = {
      ...reqOptions,
      remarkPlugins,
      rehypePlugins,
    };
    compilerCache.set(this.query, [createCompiler(options), options]);
  }

  const [compiler, options] = compilerCache.get(this.query)!;

  let result: string;
  try {
    result = await compiler
      .process({
        contents: content,
        path: this.resourcePath,
      })
      .then((res) => res.toString());
  } catch (err) {
    return callback(err as Error);
  }

  // MDX partials are MDX files starting with _ or in a folder starting with _
  // Partial are not expected to have associated metadata files or front matter
  const isMDXPartial = options.isMDXPartial?.(filePath);
  if (isMDXPartial && hasFrontMatter) {
    const errorMessage = `Docusaurus MDX partial files should not contain front matter.
Those partial files use the _ prefix as a convention by default, but this is configurable.
File at ${filePath} contains front matter that will be ignored:
${JSON.stringify(frontMatter, null, 2)}`;

    if (!options.isMDXPartialFrontMatterWarningDisabled) {
      const shouldError = process.env.NODE_ENV === 'test' || process.env.CI;
      if (shouldError) {
        return callback(new Error(errorMessage));
      }
      logger.warn(errorMessage);
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
    ? (JSON.parse(metadataJsonString) as {[key: string]: unknown})
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
${pragma}
import React from 'react';
import { mdx } from '@mdx-js/react';

${exportsCode}
${result}
`;

  return callback(null, code);
}
