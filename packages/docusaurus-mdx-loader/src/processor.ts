/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import headings from './remark/headings';
import contentTitle from './remark/contentTitle';
import toc from './remark/toc';
import transformImage from './remark/transformImage';
import transformLinks from './remark/transformLinks';
import details from './remark/details';
import head from './remark/head';
import mermaid from './remark/mermaid';
import transformAdmonitions from './remark/admonitions';
import unusedDirectivesWarning from './remark/unusedDirectives';
import codeCompatPlugin from './remark/mdx1Compat/codeCompatPlugin';
import {getFormat} from './format';
import type {WebpackCompilerName} from '@docusaurus/utils';
import type {MDXFrontMatter} from './frontMatter';
import type {Options} from './loader';
import type {AdmonitionOptions} from './remark/admonitions';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {ProcessorOptions} from '@mdx-js/mdx';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
type Pluggable = any; // TODO fix this asap

type SimpleProcessorResult = {content: string; data: {[key: string]: unknown}};

// TODO alt interface because impossible to import type Processor (ESM + TS :/)
type SimpleProcessor = {
  process: ({
    content,
    filePath,
    frontMatter,
    compilerName,
  }: {
    content: string;
    filePath: string;
    frontMatter: {[key: string]: unknown};
    compilerName: WebpackCompilerName;
  }) => Promise<SimpleProcessorResult>;
};

async function getDefaultRemarkPlugins(): Promise<MDXPlugin[]> {
  const {default: emoji} = await import('remark-emoji');
  return [headings, emoji, toc];
}

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

// Need to be async due to ESM dynamic imports...
async function createProcessorFactory() {
  const {createProcessor: createMdxProcessor} = await import('@mdx-js/mdx');
  const {default: frontmatter} = await import('remark-frontmatter');
  const {default: rehypeRaw} = await import('rehype-raw');
  const {default: gfm} = await import('remark-gfm');
  // TODO using fork until PR merged: https://github.com/leebyron/remark-comment/pull/3
  const {default: comment} = await import('@slorber/remark-comment');
  const {default: directive} = await import('remark-directive');
  const {VFile} = await import('vfile');

  const defaultRemarkPlugins = await getDefaultRemarkPlugins();

  // /!\ this method is synchronous on purpose
  // Using async code here can create cache entry race conditions!
  function createProcessorSync({
    options,
    format,
  }: {
    options: Options;
    format: 'md' | 'mdx';
  }): SimpleProcessor {
    const remarkPlugins: MDXPlugin[] = [
      ...(options.beforeDefaultRemarkPlugins ?? []),
      frontmatter,
      directive,
      [contentTitle, {removeContentTitle: options.removeContentTitle}],
      ...getAdmonitionsPlugins(options.admonitions ?? false),
      ...defaultRemarkPlugins,
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
      unusedDirectivesWarning,
    ].filter((plugin): plugin is MDXPlugin => Boolean(plugin));

    // codeCompatPlugin needs to be applied last after user-provided plugins
    // (after npm2yarn for example)
    remarkPlugins.push(codeCompatPlugin);

    const rehypePlugins: MDXPlugin[] = [
      ...(options.beforeDefaultRehypePlugins ?? []),
      ...(options.rehypePlugins ?? []),
    ];

    if (format === 'md') {
      // This is what permits to embed HTML elements with format 'md'
      // See https://github.com/facebook/docusaurus/pull/8960
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
      rehypePlugins.unshift(rehypeRawPlugin);
    }

    const processorOptions: ProcessorOptions & Options = {
      ...options,
      remarkPlugins,
      rehypePlugins,
      providerImportSource: '@mdx-js/react',
    };

    const mdxProcessor = createMdxProcessor({
      ...processorOptions,
      format,
    });

    return {
      process: async ({content, filePath, frontMatter, compilerName}) => {
        const vfile = new VFile({
          value: content,
          path: filePath,
          data: {
            frontMatter,
            compilerName,
          },
        });
        return mdxProcessor.process(vfile).then((result) => ({
          content: result.toString(),
          data: result.data,
        }));
      },
    };
  }

  return {createProcessorSync};
}

// Will be useful for tests
export async function createProcessorUncached(parameters: {
  options: Options;
  format: 'md' | 'mdx';
}): Promise<SimpleProcessor> {
  const {createProcessorSync} = await createProcessorFactory();
  return createProcessorSync(parameters);
}

// We use different compilers depending on the file type (md vs mdx)
type ProcessorsCacheEntry = {
  mdProcessor: SimpleProcessor;
  mdxProcessor: SimpleProcessor;
};

// Compilers are cached so that Remark/Rehype plugins can run
// expensive code during initialization
const ProcessorsCache = new Map<string | Options, ProcessorsCacheEntry>();

async function createProcessorsCacheEntry({
  query,
  reqOptions,
}: {
  query: string | Options;
  reqOptions: Options;
}): Promise<ProcessorsCacheEntry> {
  const {createProcessorSync} = await createProcessorFactory();

  const compilers = ProcessorsCache.get(query);
  if (compilers) {
    return compilers;
  }

  const compilerCacheEntry: ProcessorsCacheEntry = {
    mdProcessor: createProcessorSync({
      options: reqOptions,
      format: 'md',
    }),
    mdxProcessor: createProcessorSync({
      options: reqOptions,
      format: 'mdx',
    }),
  };

  ProcessorsCache.set(query, compilerCacheEntry);

  return compilerCacheEntry;
}

export async function createProcessorCached({
  filePath,
  mdxFrontMatter,
  query,
  reqOptions,
}: {
  filePath: string;
  mdxFrontMatter: MDXFrontMatter;
  query: string | Options;
  reqOptions: Options;
}): Promise<SimpleProcessor> {
  const compilers = await createProcessorsCacheEntry({query, reqOptions});

  const format = getFormat({
    filePath,
    frontMatterFormat: mdxFrontMatter.format,
    markdownConfigFormat: reqOptions.markdownConfig.format,
  });

  return format === 'md' ? compilers.mdProcessor : compilers.mdxProcessor;
}
