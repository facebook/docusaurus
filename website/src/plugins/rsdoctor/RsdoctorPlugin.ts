/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {PluginConfig} from '@docusaurus/types';

export default (async function RsdoctorPlugin() {
  if (!process.env.RSDOCTOR) {
    return null;
  }
  console.log('Rsdoctor plugin enabled');
  const {RsdoctorWebpackMultiplePlugin} = await import(
    '@rsdoctor/webpack-plugin'
  );

  return {
    name: 'rsdoctor-plugin',
    configureWebpack: () => {
      return {
        plugins: [
          new RsdoctorWebpackMultiplePlugin({
            disableTOSUpload: true,
            supports: {
              // https://rsdoctor.dev/config/options/options#generatetilegraph
              generateTileGraph: true,
            },
            linter: {
              rules: {
                'ecma-version-check': 'off',
              },
            },
          }),
        ],
      };
    },
  };
} satisfies PluginConfig);
