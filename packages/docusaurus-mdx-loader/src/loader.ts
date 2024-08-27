/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {
  DEFAULT_PARSE_FRONT_MATTER,
  getFileLoaderUtils,
  getWebpackLoaderCompilerName,
} from '@docusaurus/utils';
import stringifyObject from 'stringify-object';
import {
  compileToJSX,
  createAssetsExportCode,
  extractContentTitleData,
  readMetadataPath,
} from './utils';
import type {
  SimpleProcessors,
  MDXOptions,
  SimpleProcessorResult,
} from './processor';
import type {ResolveMarkdownLink} from './remark/resolveMarkdownLinks';

import type {MarkdownConfig} from '@docusaurus/types';
import type {LoaderContext} from 'webpack';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
type Pluggable = any; // TODO fix this asap

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

  // Will usually be created by "createMDXLoaderItem"
  processors?: SimpleProcessors;
};

export async function mdxLoader(
  this: LoaderContext<Options>,
  fileContent: string,
): Promise<void> {
  const compilerName = getWebpackLoaderCompilerName(this);
  const callback = this.async();
  const filePath = this.resourcePath;
  const options: Options = this.getOptions();

  const {frontMatter} = await options.markdownConfig.parseFrontMatter({
    filePath,
    fileContent,
    defaultParseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  let result: SimpleProcessorResult;
  try {
    result = await compileToJSX({
      fileContent,
      filePath,
      frontMatter,
      options,
      compilerName,
    });
  } catch (error) {
    return callback(error as Error);
  }

  const contentTitle = extractContentTitleData(result.data);

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
    options.createAssets && metadata
      ? options.createAssets({frontMatter, metadata})
      : undefined;

  const fileLoaderUtils = getFileLoaderUtils(compilerName === 'server');

  // TODO use remark plugins to insert extra exports instead of string concat?
  // cf how the toc is exported
  const exportsCode = `
export const frontMatter = ${stringifyObject(frontMatter)};
export const contentTitle = ${stringifyObject(contentTitle)};
${metadataJsonString ? `export const metadata = ${metadataJsonString};` : ''}
${
  assets
    ? `export const assets = ${createAssetsExportCode({
        assets,
        inlineMarkdownAssetImageFileLoader:
          fileLoaderUtils.loaders.inlineMarkdownAssetImageFileLoader,
      })};`
    : ''
}
`;

  const code = `
${exportsCode}
${result.content}
`;

  return callback(null, code);
}
