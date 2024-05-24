/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import logger from '@docusaurus/logger';
import {
  DEFAULT_PARSE_FRONT_MATTER,
  escapePath,
  getFileLoaderUtils,
  getWebpackLoaderCompilerName,
} from '@docusaurus/utils';
import stringifyObject from 'stringify-object';
import preprocessor from './preprocessor';
import {validateMDXFrontMatter} from './frontMatter';
import {createProcessorCached} from './processor';
import type {ResolveMarkdownLink} from './remark/resolveMarkdownLinks';
import type {MDXOptions} from './processor';

import type {MarkdownConfig} from '@docusaurus/types';
import type {LoaderContext} from 'webpack';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
type Pluggable = any; // TODO fix this asap

const {
  loaders: {inlineMarkdownAssetImageFileLoader},
} = getFileLoaderUtils();

export type MDXPlugin = Pluggable;

export type Options = Partial<MDXOptions> & {
  markdownConfig: MarkdownConfig;
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
  resolveMarkdownLink?: ResolveMarkdownLink;
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
      return `require("${inlineMarkdownAssetImageFileLoader}${escapePath(
        assetValue,
      )}").default`;
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

// TODO temporary, remove this after v3.1?
// Some plugin authors use our mdx-loader, despite it not being public API
// see https://github.com/facebook/docusaurus/issues/8298
function ensureMarkdownConfig(reqOptions: Options) {
  if (!reqOptions.markdownConfig) {
    throw new Error(
      'Docusaurus v3+ requires MDX loader options.markdownConfig - plugin authors using the MDX loader should make sure to provide that option',
    );
  }
}

/**
 * data.contentTitle is set by the remark contentTitle plugin
 */
function extractContentTitleData(data: {
  [key: string]: unknown;
}): string | undefined {
  return data.contentTitle as string | undefined;
}

export async function mdxLoader(
  this: LoaderContext<Options>,
  fileContent: string,
): Promise<void> {
  const compilerName = getWebpackLoaderCompilerName(this);
  const callback = this.async();
  const filePath = this.resourcePath;
  const reqOptions: Options = this.getOptions();
  const {query} = this;

  ensureMarkdownConfig(reqOptions);

  const {frontMatter} = await reqOptions.markdownConfig.parseFrontMatter({
    filePath,
    fileContent,
    defaultParseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
  });
  const mdxFrontMatter = validateMDXFrontMatter(frontMatter.mdx);

  const preprocessedContent = preprocessor({
    fileContent,
    filePath,
    admonitions: reqOptions.admonitions,
    markdownConfig: reqOptions.markdownConfig,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  const processor = await createProcessorCached({
    filePath,
    reqOptions,
    query,
    mdxFrontMatter,
  });

  let result: {content: string; data: {[key: string]: unknown}};
  try {
    result = await processor.process({
      content: preprocessedContent,
      filePath,
      frontMatter,
      compilerName,
    });
  } catch (errorUnknown) {
    const error = errorUnknown as Error;

    // MDX can emit errors that have useful extra attributes
    const errorJSON = JSON.stringify(error, null, 2);
    const errorDetails =
      errorJSON === '{}'
        ? // regular JS error case: print stacktrace
          error.stack ?? 'N/A'
        : // MDX error: print extra attributes + stacktrace
          `${errorJSON}\n${error.stack}`;

    return callback(
      new Error(
        `MDX compilation failed for file ${logger.path(filePath)}\nCause: ${
          error.message
        }\nDetails:\n${errorDetails}`,
        // TODO error cause doesn't seem to be used by Webpack stats.errors :s
        {cause: error},
      ),
    );
  }

  const contentTitle = extractContentTitleData(result.data);

  // MDX partials are MDX files starting with _ or in a folder starting with _
  // Partial are not expected to have associated metadata files or front matter
  const isMDXPartial = reqOptions.isMDXPartial?.(filePath);
  if (isMDXPartial && hasFrontMatter) {
    const errorMessage = `Docusaurus MDX partial files should not contain front matter.
Those partial files use the _ prefix as a convention by default, but this is configurable.
File at ${filePath} contains front matter that will be ignored:
${JSON.stringify(frontMatter, null, 2)}`;

    if (!reqOptions.isMDXPartialFrontMatterWarningDisabled) {
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
      if (
        reqOptions.metadataPath &&
        typeof reqOptions.metadataPath === 'function'
      ) {
        return reqOptions.metadataPath(filePath);
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

  // TODO use remark plugins to insert extra exports instead of string concat?
  // cf how the toc is exported
  const exportsCode = `
export const frontMatter = ${stringifyObject(frontMatter)};
export const contentTitle = ${stringifyObject(contentTitle)};
${metadataJsonString ? `export const metadata = ${metadataJsonString};` : ''}
${assets ? `export const assets = ${createAssetsExportCode(assets)};` : ''}
`;

  const code = `
${exportsCode}
${result.content}
`;

  return callback(null, code);
}
