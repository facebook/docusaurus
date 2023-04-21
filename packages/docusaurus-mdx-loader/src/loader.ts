/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import {
  parseFrontMatter,
  parseMarkdownContentTitle,
  escapePath,
  getFileLoaderUtils,
} from '@docusaurus/utils';
import emoji from 'remark-emoji';
import stringifyObject from 'stringify-object';
import preprocessor from './preprocessor';
import headings from './remark/headings';
import toc from './remark/toc';
import transformImage from './remark/transformImage';
import transformLinks from './remark/transformLinks';
import details from './remark/details';
import head from './remark/head';
import mermaid from './remark/mermaid';
import transformAdmonitions from './remark/admonitions';
import codeCompatPlugin from './remark/mdx1Compat/codeCompatPlugin';
import {validateMDXFrontMatter} from './frontMatter';

import type {MarkdownConfig} from '@docusaurus/types';
import type {LoaderContext} from 'webpack';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Processor} from 'unified';
import type {AdmonitionOptions} from './remark/admonitions';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {ProcessorOptions} from '@mdx-js/mdx';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
type Pluggable = any; // TODO fix this asap

// Copied from https://mdxjs.com/packages/mdx/#optionsmdextensions
// Although we are likely to only use .md / .mdx anyway...
const mdFormatExtensions = [
  '.md',
  '.markdown',
  '.mdown',
  '.mkdn',
  '.mkd',
  '.mdwn',
  '.mkdown',
  '.ron',
];

function isMDFormat(filepath: string) {
  return mdFormatExtensions.includes(path.extname(filepath));
}

const {
  loaders: {inlineMarkdownImageFileLoader},
} = getFileLoaderUtils();

const DEFAULT_OPTIONS: MDXOptions = {
  admonitions: true,
  rehypePlugins: [],
  remarkPlugins: [emoji, headings, toc],
  beforeDefaultRemarkPlugins: [],
  beforeDefaultRehypePlugins: [],
};

type CompilerCacheEntry = {
  mdCompiler: Processor;
  mdxCompiler: Processor;
  options: Options;
};

const compilerCache = new Map<string | Options, CompilerCacheEntry>();

export type MDXPlugin = Pluggable;

export type MDXOptions = {
  admonitions: boolean | Partial<AdmonitionOptions>;
  remarkPlugins: MDXPlugin[];
  rehypePlugins: MDXPlugin[];
  beforeDefaultRemarkPlugins: MDXPlugin[];
  beforeDefaultRehypePlugins: MDXPlugin[];
};

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

export async function mdxLoader(
  this: LoaderContext<Options>,
  fileString: string,
): Promise<void> {
  const callback = this.async();
  const filePath = this.resourcePath;
  const reqOptions = this.getOptions();
  ensureMarkdownConfig(reqOptions);

  const {createProcessor} = await import('@mdx-js/mdx');
  const {default: gfm} = await import('remark-gfm');
  const {default: comment} = await import('remark-comment');
  const {default: directives} = await import('remark-directive');

  const {frontMatter, content: contentWithTitle} = parseFrontMatter(fileString);
  const mdxFrontMatter = validateMDXFrontMatter(frontMatter.mdx);

  const {content: contentUnprocessed, contentTitle} = parseMarkdownContentTitle(
    contentWithTitle,
    {
      removeContentTitle: reqOptions.removeContentTitle,
    },
  );

  const content = preprocessor({
    fileContent: contentUnprocessed,
    filePath,
    admonitions: reqOptions.admonitions,
    markdownConfig: reqOptions.markdownConfig,
  });

  const hasFrontMatter = Object.keys(frontMatter).length > 0;

  if (!compilerCache.has(this.query)) {
    /*
    /!\ DO NOT PUT ANY ASYNC / AWAIT / DYNAMIC IMPORTS HERE
    This creates cache creation race conditions
    TODO extract this in a synchronous method
     */

    const remarkPlugins: MDXPlugin[] = [
      ...(reqOptions.beforeDefaultRemarkPlugins ?? []),
      directives,
      ...getAdmonitionsPlugins(reqOptions.admonitions ?? false),
      ...DEFAULT_OPTIONS.remarkPlugins,
      details,
      head,
      ...(reqOptions.markdownConfig.mermaid ? [mermaid] : []),
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
      gfm,
      reqOptions.markdownConfig.mdx1Compat.comments ? comment : null,
      ...(reqOptions.remarkPlugins ?? []),
    ].filter((plugin): plugin is MDXPlugin => Boolean(plugin));

    // codeCompatPlugin needs to be applied last after user-provided plugins
    // (after npm2yarn for example)
    remarkPlugins.push(codeCompatPlugin);

    const rehypePlugins: MDXPlugin[] = [
      ...(reqOptions.beforeDefaultRehypePlugins ?? []),
      ...DEFAULT_OPTIONS.rehypePlugins,
      ...(reqOptions.rehypePlugins ?? []),
    ];

    const options: ProcessorOptions & Options = {
      ...reqOptions,
      remarkPlugins,
      rehypePlugins,
      providerImportSource: '@mdx-js/react',
    };

    const compilerCacheEntry: CompilerCacheEntry = {
      mdCompiler: createProcessor({
        ...options,
        format: 'md',
      }),
      mdxCompiler: createProcessor({
        ...options,
        format: 'mdx',
      }),
      options,
    };

    compilerCache.set(this.query, compilerCacheEntry);
  }

  const {mdCompiler, mdxCompiler, options} = compilerCache.get(this.query)!;

  function getCompiler() {
    const format =
      mdxFrontMatter.format === 'detect'
        ? isMDFormat(filePath)
          ? 'md'
          : 'mdx'
        : mdxFrontMatter.format;

    return format === 'md' ? mdCompiler : mdxCompiler;
  }

  let result: string;
  try {
    result = await getCompiler()
      .process({
        value: content,
        path: filePath,
      })
      .then((res) => res.toString());
  } catch (errorUnknown) {
    const error = errorUnknown as Error;
    return callback(
      new Error(
        `MDX compilation failed for file ${logger.path(filePath)}\nCause: ${
          error.message
        }\nDetails:\n${JSON.stringify(error, null, 2)}`,
        // TODO error cause doesn't seem to be used by Webpack stats.errors :s
        {cause: error},
      ),
    );
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
${result}
`;

  return callback(null, code);
}
