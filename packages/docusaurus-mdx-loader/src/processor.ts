/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import emoji from 'remark-emoji';
import headings from './remark/headings';
import toc from './remark/toc';
import transformImage from './remark/transformImage';
import transformLinks from './remark/transformLinks';
import details from './remark/details';
import head from './remark/head';
import mermaid from './remark/mermaid';
import transformAdmonitions from './remark/admonitions';
import codeCompatPlugin from './remark/mdx1Compat/codeCompatPlugin';
import {getFormat} from './format';
import type {MDXFrontMatter} from './frontMatter';
import type {Options} from './loader';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {Processor} from 'unified';
import type {AdmonitionOptions} from './remark/admonitions';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {ProcessorOptions} from '@mdx-js/mdx';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
type Pluggable = any; // TODO fix this asap

const DEFAULT_OPTIONS: MDXOptions = {
  admonitions: true,
  rehypePlugins: [],
  remarkPlugins: [emoji, headings, toc],
  beforeDefaultRemarkPlugins: [],
  beforeDefaultRehypePlugins: [],
};

export type MDXPlugin = Pluggable;

export type MDXOptions = {
  admonitions: boolean | Partial<AdmonitionOptions>;
  remarkPlugins: MDXPlugin[];
  rehypePlugins: MDXPlugin[];
  beforeDefaultRemarkPlugins: MDXPlugin[];
  beforeDefaultRehypePlugins: MDXPlugin[];
};

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

async function loadEsmLibs() {
  const {createProcessor} = await import('@mdx-js/mdx');
  const {default: rehypeRaw} = await import('rehype-raw');
  const {default: gfm} = await import('remark-gfm');
  const {default: comment} = await import('remark-comment');
  const {default: directive} = await import('remark-directive');
  return {createProcessor, rehypeRaw, gfm, comment, directive};
}
type EsmLibs = Awaited<ReturnType<typeof loadEsmLibs>>;

// /!\ this method is synchronous on purpose
// Using async code here can create cache entry race conditions!
function createProcessorSync({
  esmLibs,
  options,
  format,
}: {
  esmLibs: EsmLibs;
  options: Options;
  format: 'md' | 'mdx';
}): Processor {
  const {createProcessor, rehypeRaw, gfm, comment, directive} = esmLibs;

  const remarkPlugins: MDXPlugin[] = [
    ...(options.beforeDefaultRemarkPlugins ?? []),
    directive,
    ...getAdmonitionsPlugins(options.admonitions ?? false),
    ...DEFAULT_OPTIONS.remarkPlugins,
    details,
    head,
    ...(options.markdownConfig.mermaid ? [mermaid] : []),
    [
      transformImage,
      {
        staticDirs: options.staticDirs,
        siteDir: options.siteDir,
      },
    ],
    [
      transformLinks,
      {
        staticDirs: options.staticDirs,
        siteDir: options.siteDir,
      },
    ],
    gfm,
    options.markdownConfig.mdx1Compat.comments ? comment : null,
    ...(options.remarkPlugins ?? []),
  ].filter((plugin): plugin is MDXPlugin => Boolean(plugin));

  // codeCompatPlugin needs to be applied last after user-provided plugins
  // (after npm2yarn for example)
  remarkPlugins.push(codeCompatPlugin);

  // This is what permits to embed HTML elements with format 'md'
  // See https://github.com/mdx-js/mdx/pull/2295#issuecomment-1540085960
  const rehypeRawPlugin: MDXPlugin = [
    rehypeRaw,
    {
      passThrough: [
        'mdxFlowExpression',
        'mdxJsxFlowElement',
        'mdxJsxTextElement',
        'mdxTextExpression',
        'mdxjsEsm',
      ],
    },
  ];

  const rehypePlugins: MDXPlugin[] = [
    rehypeRawPlugin,
    ...(options.beforeDefaultRehypePlugins ?? []),
    ...DEFAULT_OPTIONS.rehypePlugins,
    ...(options.rehypePlugins ?? []),
  ];

  const processorOptions: ProcessorOptions & Options = {
    ...options,
    remarkPlugins,
    rehypePlugins,
    providerImportSource: '@mdx-js/react',
  };

  return createProcessor({
    ...processorOptions,
    format,
  });
}

// We use different compilers depending on the file type (md vs mdx)
type ProcessorsCacheEntry = {
  mdProcessor: Processor;
  mdxProcessor: Processor;
};

// Compilers are cached so that Remark/Rehype plugins can run
// expensive code during initialization
const ProcessorsCache = new Map<string | Options, ProcessorsCacheEntry>();

export async function getProcessorsCached({
  query,
  reqOptions,
}: {
  query: string | Options;
  reqOptions: Options;
}): Promise<ProcessorsCacheEntry> {
  const esmLibs = await loadEsmLibs();
  const compilers = ProcessorsCache.get(query);
  if (compilers) {
    return compilers;
  }

  const compilerCacheEntry: ProcessorsCacheEntry = {
    mdProcessor: createProcessorSync({
      esmLibs,
      options: reqOptions,
      format: 'md',
    }),
    mdxProcessor: createProcessorSync({
      esmLibs,
      options: reqOptions,
      format: 'mdx',
    }),
  };

  ProcessorsCache.set(query, compilerCacheEntry);

  return compilerCacheEntry;
}

export async function getProcessorCached({
  filePath,
  mdxFrontMatter,
  query,
  reqOptions,
}: {
  filePath: string;
  mdxFrontMatter: MDXFrontMatter;
  query: string | Options;
  reqOptions: Options;
}): Promise<Processor> {
  const compilers = await getProcessorsCached({query, reqOptions});
  const format = getFormat({
    filePath,
    frontMatterFormat: mdxFrontMatter.format,
  });
  return format === 'md' ? compilers.mdProcessor : compilers.mdxProcessor;
}
