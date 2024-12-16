/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getFileLoaderUtils} from '@docusaurus/utils';

import type {SVGRConfig, SVGOConfig} from './options';
import type {RuleSetRule} from 'webpack';

// TODO Docusaurus v4: change these defaults?
//  see https://github.com/facebook/docusaurus/issues/8297
//  see https://github.com/facebook/docusaurus/pull/10205
//  see https://github.com/facebook/docusaurus/pull/10211
const DefaultSVGOConfig: SVGOConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeTitle: false,
          removeViewBox: false,
        },
      },
    },
  ],
};

const DefaultSVGRConfig: SVGRConfig = {
  prettier: false,
  svgo: true,
  svgoConfig: DefaultSVGOConfig,
  titleProp: true,
};

type Params = {isServer: boolean; svgrConfig: SVGRConfig};

function createSVGRLoader(params: Params): RuleSetRule {
  const options: SVGRConfig = {
    ...DefaultSVGRConfig,
    ...params.svgrConfig,
  };
  return {
    loader: require.resolve('@svgr/webpack'),
    options,
  };
}

export function createLoader(params: Params): RuleSetRule {
  const utils = getFileLoaderUtils(params.isServer);
  return {
    test: /\.svg$/i,
    oneOf: [
      {
        use: [createSVGRLoader(params)],
        // We don't want to use SVGR loader for non-React source code
        // ie we don't want to use SVGR for CSS files...
        issuer: {
          and: [/\.(?:tsx?|jsx?|mdx?)$/i],
        },
      },
      {
        use: [utils.loaders.url({folder: 'images'})],
      },
    ],
  };
}
