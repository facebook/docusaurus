/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {minify as terserHtmlMinifier} from 'html-minifier-terser';
import {importSwcHtmlMinifier} from './importFaster';

// Historical env variable
const SkipHtmlMinification = process.env.SKIP_HTML_MINIFICATION === 'true';

export type HtmlMinifierType = 'swc' | 'terser';

export type HtmlMinifierResult = {
  code: string;
  warnings: string[];
};

export type HtmlMinifier = {
  minify: (html: string) => Promise<HtmlMinifierResult>;
};

const NoopMinifier: HtmlMinifier = {
  minify: async (html: string) => ({code: html, warnings: []}),
};

export async function getHtmlMinifier({
  type,
}: {
  type: HtmlMinifierType;
}): Promise<HtmlMinifier> {
  if (SkipHtmlMinification) {
    return NoopMinifier;
  }
  if (type === 'swc') {
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
        const code = await terserHtmlMinifier(html, {
          // When enabled => React hydration errors
          removeComments: false,
          removeRedundantAttributes: false,
          removeEmptyAttributes: false,
          sortAttributes: false,
          sortClassName: false,

          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyJS: true,
        });
        return {code, warnings: []};
      } catch (err) {
        throw new Error(`HTML minification failed (Terser)`, {
          cause: err as Error,
        });
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

          // When enabled => hydration error for className={"yt-lite "}
          normalizeAttributes: false,
          // When enabled => hydration error for className=""
          removeEmptyAttributes: false,
          // When enabled => hydration error for <a target="_self">
          removeRedundantAttributes: 'none',

          minifyJs: true,
          minifyJson: true,
          minifyCss: true,
        });

        const warnings = (result.errors ?? []).map((diagnostic) => {
          return `[HTML minifier diagnostic - ${diagnostic.level}] ${
            diagnostic.message
          } - ${JSON.stringify(diagnostic.span)}`;
        });

        return {
          code: result.code,
          warnings,
        };
      } catch (err) {
        throw new Error(`HTML minification failed (SWC)`, {
          cause: err as Error,
        });
      }
    },
  };
}
