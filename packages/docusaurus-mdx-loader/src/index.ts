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
} from '@docusaurus/utils';
import stringifyObject from 'stringify-object';
import headings from './remark/headings';
import toc from './remark/toc';
import unwrapMdxCodeBlocks from './remark/unwrapMdxCodeBlocks';
import transformImage from './remark/transformImage';
import transformLinks from './remark/transformLinks';
import {getFileLoaderUtils} from '@docusaurus/core/lib/webpack/utils';
import type {RemarkAndRehypePluginOptions} from '@docusaurus/mdx-loader';

// TODO temporary until Webpack5 export this type
// see https://github.com/webpack/webpack/issues/11630
interface Loader extends Function {
  (this: any, source: string): Promise<string | Buffer | void | undefined>;
}

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

const DEFAULT_OPTIONS: RemarkAndRehypePluginOptions = {
  rehypePlugins: [],
  remarkPlugins: [unwrapMdxCodeBlocks, emoji, headings, toc],
  beforeDefaultRemarkPlugins: [],
  beforeDefaultRehypePlugins: [],
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

// For some specific FrontMatter fields, we want to allow referencing local relative assets so that they enter the Webpack asset pipeline
// We don't do that for all frontMatters, only for the configured keys
// {image: "./myImage.png"} => {image: require("./myImage.png")}
function createFrontMatterAssetsExportCode(
  frontMatter: Record<string, unknown>,
  frontMatterAssetKeys: string[] = [],
) {
  if (frontMatterAssetKeys.length === 0) {
    return 'undefined';
  }

  function createFrontMatterAssetRequireCode(value: unknown) {
    // Only process string values starting with ./
    // We could enhance this logic and check if file exists on disc?
    if (typeof value === 'string' && value.startsWith('./')) {
      // TODO do we have other use-cases than image assets?
      // Probably not worth adding more support, as we want to move to Webpack 5 new asset system (https://github.com/facebook/docusaurus/pull/4708)
      const inlineLoader = inlineMarkdownImageFileLoader;
      return `require("${inlineLoader}${escapePath(value)}").default`;
    }
    return undefined;
  }

  const frontMatterAssetEntries = Object.entries(frontMatter).filter(([key]) =>
    frontMatterAssetKeys.includes(key),
  );

  const lines = frontMatterAssetEntries
    .map(([key, value]) => {
      const assetRequireCode = createFrontMatterAssetRequireCode(value);
      return assetRequireCode ? `"${key}": ${assetRequireCode},` : undefined;
    })
    .filter(Boolean);

  const exportValue = `{\n${lines.join('\n')}\n}`;

  return exportValue;
}

const docusaurusMdxLoader: Loader = async function (fileString) {
  const callback = this.async();
  const filePath = this.resourcePath;
  const reqOptions = this.getOptions() || {};

  const {frontMatter, content: contentWithTitle} = parseFrontMatter(fileString);

  const {content, contentTitle} = parseMarkdownContentTitle(contentWithTitle, {
    removeContentTitle: reqOptions.removeContentTitle,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  const options = {
    ...reqOptions,
    remarkPlugins: [
      ...(reqOptions.beforeDefaultRemarkPlugins || []),
      ...DEFAULT_OPTIONS.remarkPlugins,
      [transformImage, {staticDir: reqOptions.staticDir, filePath}],
      [transformLinks, {staticDir: reqOptions.staticDir, filePath}],
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
    return callback(err);
  }

  let exportStr = `
export const frontMatter = ${stringifyObject(frontMatter)};
export const frontMatterAssets = ${createFrontMatterAssetsExportCode(
    frontMatter,
    reqOptions.frontMatterAssetKeys,
  )};
export const contentTitle = ${stringifyObject(contentTitle)};`;

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

  if (!isMDXPartial) {
    // Read metadata for this MDX and export it.
    if (options.metadataPath && typeof options.metadataPath === 'function') {
      const metadataPath = options.metadataPath(filePath);

      if (metadataPath) {
        const metadata = await readMetadataPath(metadataPath);
        exportStr += `\nexport const metadata = ${metadata};`;
        // Add as dependency of this loader result so that we can
        // recompile if metadata is changed.
        this.addDependency(metadataPath);
      }
    }
  }

  const code = `
import React from 'react';
import { mdx } from '@mdx-js/react';

${exportStr}
${result}
`;

  return callback(null, code);
};

export default docusaurusMdxLoader;
