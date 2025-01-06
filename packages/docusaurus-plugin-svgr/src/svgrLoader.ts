/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getFileLoaderUtils} from '@docusaurus/utils';

import type {SVGRConfig, SVGOConfig} from './options';
import type {Configuration, RuleSetRule} from 'webpack';

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

function createSVGRRule(params: Params): RuleSetRule {
  const options: SVGRConfig = {
    ...DefaultSVGRConfig,
    ...params.svgrConfig,
  };
  return {
    loader: require.resolve('@svgr/webpack'),
    options,
  };
}

export function enhanceConfig(config: Configuration, params: Params): void {
  const utils = getFileLoaderUtils(params.isServer);

  const rules = config?.module?.rules as RuleSetRule[];

  const existingSvgRule: RuleSetRule = (() => {
    const rule = rules.find(
      (r) => String(r.test) === String(utils.rules.svgs().test),
    );
    if (!rule) {
      throw new Error(
        "Docusaurus built-in SVG rule couldn't be found. The SVGR plugin can't enhance it.",
      );
    }
    return rule;
  })();

  const newSvgRule: RuleSetRule = {
    test: /\.svg$/i,
    oneOf: [
      {
        use: [createSVGRRule(params)],
        // We don't want to use SVGR loader for non-React source code
        // ie we don't want to use SVGR for CSS files...
        issuer: {
          and: [/\.(?:tsx?|jsx?|mdx?)$/i],
        },
      },
      existingSvgRule,
    ],
  };

  // This is annoying, but we have to "wrap" the existing SVG rule
  // Adding another extra SVG rule (first or last) will not "override"
  // the default: both rules will be applied (from last to bottom) leading to
  // conflicting behavior.
  const index = rules.indexOf(existingSvgRule);
  rules[index] = newSvgRule;
}
