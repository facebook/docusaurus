/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {minify as terserHtmlMinifier} from 'html-minifier-terser';
import {importSwcHtmlMinifier} from './importFaster';
import type {DocusaurusConfig} from '@docusaurus/types';

// Historical env variable
const SkipHtmlMinification = process.env.SKIP_HTML_MINIFICATION === 'true';

export type HtmlMinifier = {
  minify: (html: string) => Promise<string>;
};

const NoopMinifier: HtmlMinifier = {
  minify: async (html: string) => html,
};

type SiteConfigSlice = {
  future: {
    experimental_faster: Pick<
      DocusaurusConfig['future']['experimental_faster'],
      'swcHtmlMinimizer'
    >;
  };
};

export async function getHtmlMinifier({
  siteConfig,
}: {
  siteConfig: SiteConfigSlice;
}): Promise<HtmlMinifier> {
  if (SkipHtmlMinification) {
    return NoopMinifier;
  }
  if (siteConfig.future.experimental_faster.swcHtmlMinimizer) {
    return getSwcMinifier();
  } else {
    return getTerserMinifier();
  }
}

// Minify html with https://github.com/DanielRuf/html-minifier-terser
async function getTerserMinifier(): Promise<HtmlMinifier> {
  return {
    minify: async function minifyHtmlWithTerser(html) {
      try {
        return await terserHtmlMinifier(html, {
          removeComments: false,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyJS: true,
        });
      } catch (err) {
        throw new Error('HTML minification failed', {cause: err as Error});
      }
    },
  };
}

// Minify html with @swc/html
// Not well-documented but fast!
// See https://github.com/swc-project/swc/discussions/9616
async function getSwcMinifier(): Promise<HtmlMinifier> {
  const swcHtmlMinifier = await importSwcHtmlMinifier();
  return {
    minify: async function minifyHtmlWithSwc(html) {
      try {
        const result = await swcHtmlMinifier(Buffer.from(html), {
          // Removing comments can lead to React hydration errors
          // See https://x.com/sebastienlorber/status/1841966927440478577
          removeComments: false,
          // TODO maybe it's fine to only keep <!-- --> React comments?
          preserveComments: [],

          // Sorting these attributes (class) can lead to React hydration errors
          sortSpaceSeparatedAttributeValues: false,
          sortAttributes: false,

          // @ts-expect-error: bad type https://github.com/swc-project/swc/pull/9615
          removeRedundantAttributes: 'all',
          removeEmptyAttributes: true,
          minifyJs: true,
          minifyJson: true,
          minifyCss: true,
        });
        return result.code;
      } catch (err) {
        throw new Error('HTML minification failed', {cause: err as Error});
      }
    },
  };
}
