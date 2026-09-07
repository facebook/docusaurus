/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getCSSExtractPlugin} from '../currentBundler';
import type {ConfigureWebpackUtils, CurrentBundler} from '@docusaurus/types';

export async function createStyleLoadersFactory({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<ConfigureWebpackUtils['getStyleLoaders']> {
  const CssExtractPlugin = await getCSSExtractPlugin({currentBundler});

  return function getStyleLoaders(
    isServer: boolean,
    cssLoaderOptionsArg: {
      [key: string]: unknown;
    } = {},
  ) {
    function getCssModulesOptions() {
      const defaultModules = {
        // Keep exported CSS module class names compatible with css-loader v6
        // ".themedComponent--dark" => not converted as .themedComponentDark
        // See https://github.com/webpack/css-loader/releases/tag/v7.0.0
        exportLocalsConvention: 'as-is',
      };

      const modulesArg = cssLoaderOptionsArg.modules;
      if (
        modulesArg === null ||
        typeof modulesArg === 'boolean' ||
        typeof modulesArg === 'string'
      ) {
        return modulesArg;
      }
      if (typeof modulesArg === 'object' && !Array.isArray(modulesArg)) {
        return {
          ...defaultModules,
          ...modulesArg,
        };
      }
      throw new Error(
        `unexpected cssOptionsArg.modules type: ${typeof modulesArg}`,
      );
    }

    function getCssLoaderOptions(): {[key: string]: unknown} {
      const modules = getCssModulesOptions();

      return {
        // TODO turn esModule on later, see https://github.com/facebook/docusaurus/pull/6424
        esModule: false,
        ...cssLoaderOptionsArg,
        ...(modules !== undefined && {modules}),
      };
    }

    const cssLoaderOptions = getCssLoaderOptions();

    // On the server we don't really need to extract/emit CSS
    // We only need to transform CSS module imports to a styles object
    if (isServer) {
      return cssLoaderOptions.modules
        ? [
            {
              loader: require.resolve('css-loader'),
              options: cssLoaderOptions,
            },
          ]
        : // Ignore regular CSS files
          [{loader: require.resolve('null-loader')}];
    }

    return [
      {
        loader: CssExtractPlugin.loader,
        options: {
          esModule: true,
        },
      },
      {
        loader: require.resolve('css-loader'),
        options: cssLoaderOptions,
      },

      // TODO apart for configurePostCss(), do we really need this loader?
      // Note: using postcss here looks inefficient/duplicate
      // But in practice, it's not a big deal because css-loader also uses postcss
      // and is able to reuse the parsed AST from postcss-loader
      // See https://github.com/webpack-contrib/css-loader/blob/master/src/index.js#L159
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: [
              [
                require.resolve('postcss-preset-env'),
                {
                  // Keeping this empty options object on purpose
                  // It could be more convenient for configurePostCss() usage
                },
              ],
            ],
          },
        },
      },
    ];
  };
}
