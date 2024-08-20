/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {PluginConfig} from '@docusaurus/types';

async function createRsdoctorBundlerPlugin() {
  // TODO Shitty workaround to bypass lib typechecking
  //  package does not work will with skipLibCheck false
  // eslint-disable-next-line
  const {RsdoctorWebpackMultiplePlugin} = require('@rsdoctor/webpack-plugin');

  return new RsdoctorWebpackMultiplePlugin({
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
  });
}

export default (async function RsdoctorPlugin() {
  if (!process.env.RSDOCTOR) {
    return null;
  }
  const plugin = await createRsdoctorBundlerPlugin();
  console.log('Rsdoctor plugin enabled');
  return {
    name: 'rsdoctor-plugin',
    configureWebpack: () => {
      return {
        plugins: [plugin],
      };
    },
  };
} satisfies PluginConfig);
