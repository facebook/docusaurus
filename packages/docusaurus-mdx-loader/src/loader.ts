/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import {
  aliasedSitePath,
  DEFAULT_PARSE_FRONT_MATTER,
  getFileLoaderUtils,
  getWebpackLoaderCompilerName,
} from '@docusaurus/utils';
import stringifyObject from 'stringify-object';
import {
  compileToJSX,
  createAssetsExportCode,
  extractContentTitleData,
} from './utils';
import type {WebpackCompilerName} from '@docusaurus/utils';
import type {Options} from './options';
import type {LoaderContext} from 'webpack';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
type Pluggable = any; // TODO fix this asap

export type MDXPlugin = Pluggable;

async function loadMDX({
  fileContent,
  filePath,
  options,
  compilerName,
}: {
  fileContent: string;
  filePath: string;
  options: Options;
  compilerName: WebpackCompilerName;
}): Promise<string> {
  const {frontMatter} = await options.markdownConfig.parseFrontMatter({
    filePath,
    fileContent,
    defaultParseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  const result = await compileToJSX({
    fileContent,
    filePath,
    frontMatter,
    options,
    compilerName,
  });

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
        throw new Error(errorMessage);
      }
      logger.warn(errorMessage);
    }
  }

  const metadataPath = (function getMetadataPath() {
    if (!isMDXPartial) {
      return options.metadataPath?.(filePath);
    }
    return undefined;
  })();

  const assets =
    options.createAssets && !isMDXPartial
      ? options.createAssets({filePath, frontMatter})
      : undefined;

  const fileLoaderUtils = getFileLoaderUtils(compilerName === 'server');

  // TODO use remark plugins to insert extra exports instead of string concat?
  // cf how the toc is exported
  const exportsCode = `
export const frontMatter = ${stringifyObject(frontMatter)};
export const contentTitle = ${stringifyObject(contentTitle)};
${
  metadataPath
    ? `export {default as metadata} from '${aliasedSitePath(
        metadataPath,
        options.siteDir,
      )}'`
    : ''
}
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

  return code;
}

// Note: we cache promises instead of strings
// This is because client/server compilations might be triggered in parallel
// When this happens for the same file, we don't want to compile it twice
async function loadMDXWithCaching({
  resource,
  fileContent,
  filePath,
  options,
  compilerName,
}: {
  resource: string; // path?query#hash
  filePath: string; // path
  fileContent: string;
  options: Options;
  compilerName: WebpackCompilerName;
}): Promise<string> {
  // Note we "resource" as cache key, not "filePath" nor "fileContent"
  // This is because:
  // - the same file can be compiled in different variants (blog.mdx?truncated)
  // - the same content can be processed differently (versioned docs links)
  const cacheKey = resource;

  const cachedPromise = options.crossCompilerCache?.get(cacheKey);
  if (cachedPromise) {
    // We can clean up the cache and free memory here
    // We know there are only 2 compilations for the same file
    // Note: once we introduce RSCs we'll probably have 3 compilations
    // Note: we can't use string keys in WeakMap
    // But we could eventually use WeakRef for the values
    options.crossCompilerCache?.delete(cacheKey);
    return cachedPromise;
  }
  const promise = loadMDX({
    fileContent,
    filePath,
    options,
    compilerName,
  });
  options.crossCompilerCache?.set(cacheKey, promise);
  return promise;
}

export async function mdxLoader(
  this: LoaderContext<Options>,
  fileContent: string,
): Promise<void> {
  const compilerName = getWebpackLoaderCompilerName(this);
  const callback = this.async();
  const options: Options = this.getOptions();
  try {
    const result = await loadMDXWithCaching({
      resource: this.resource,
      filePath: this.resourcePath,
      fileContent,
      options,
      compilerName,
    });
    return callback(null, result);
  } catch (error) {
    return callback(error as Error);
  }
}
