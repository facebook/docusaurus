/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import admonitions from 'remark-admonitions';
import type {RuleSetRule} from 'webpack';
import type {HtmlTagObject, LoadedPlugin, LoadContext} from '@docusaurus/types';

/**
 * Make a synthetic plugin to:
 * - Inject site client modules
 * - Inject scripts/stylesheets
 */
export function createBootstrapPlugin({
  siteDir,
  siteConfig,
}: LoadContext): LoadedPlugin {
  const {
    stylesheets,
    scripts,
    clientModules: siteConfigClientModules,
  } = siteConfig;
  return {
    name: 'docusaurus-bootstrap-plugin',
    content: null,
    options: {
      id: 'default',
    },
    version: {type: 'synthetic'},
    path: siteDir,
    getClientModules() {
      return siteConfigClientModules;
    },
    injectHtmlTags: () => {
      const stylesheetsTags = stylesheets.map((source) =>
        typeof source === 'string'
          ? `<link rel="stylesheet" href="${source}">`
          : ({
              tagName: 'link',
              attributes: {
                rel: 'stylesheet',
                ...source,
              },
            } as HtmlTagObject),
      );
      const scriptsTags = scripts.map((source) =>
        typeof source === 'string'
          ? `<script src="${source}"></script>`
          : ({
              tagName: 'script',
              attributes: {
                ...source,
              },
            } as HtmlTagObject),
      );
      return {
        headTags: [...stylesheetsTags, ...scriptsTags],
      };
    },
  };
}

/**
 * Configure Webpack fallback mdx loader for md/mdx files out of content-plugin
 * folders. Adds a "fallback" mdx loader for mdx files that are not processed by
 * content plugins. This allows to do things such as importing repo/README.md as
 * a partial from another doc. Not ideal solution, but good enough for now
 */
export function createMDXFallbackPlugin({
  siteDir,
  siteConfig,
}: LoadContext): LoadedPlugin {
  return {
    name: 'docusaurus-mdx-fallback-plugin',
    content: null,
    options: {
      id: 'default',
    },
    version: {type: 'synthetic'},
    // Synthetic, the path doesn't matter much
    path: '.',
    configureWebpack(config, isServer, {getJSLoader}) {
      // We need the mdx fallback loader to exclude files that were already
      // processed by content plugins mdx loaders. This works, but a bit
      // hacky... Not sure there's a way to handle that differently in webpack
      function getMDXFallbackExcludedPaths(): string[] {
        const rules: RuleSetRule[] = config?.module?.rules as RuleSetRule[];
        return rules.flatMap((rule) => {
          const isMDXRule =
            rule.test instanceof RegExp && rule.test.test('x.mdx');
          return isMDXRule ? (rule.include as string[]) : [];
        });
      }
      const mdxLoaderOptions = {
        staticDirs: siteConfig.staticDirectories.map((dir) =>
          path.resolve(siteDir, dir),
        ),
        siteDir,
        // External MDX files are always meant to be imported as partials
        isMDXPartial: () => true,
        // External MDX files might have front matter, just disable the warning
        isMDXPartialFrontMatterWarningDisabled: true,
        remarkPlugins: [admonitions],
      };

      return {
        module: {
          rules: [
            {
              test: /\.mdx?$/i,
              exclude: getMDXFallbackExcludedPaths(),
              use: [
                getJSLoader({isServer}),
                {
                  loader: require.resolve('@docusaurus/mdx-loader'),
                  options: mdxLoaderOptions,
                },
              ],
            },
          ],
        },
      };
    },
  };
}
