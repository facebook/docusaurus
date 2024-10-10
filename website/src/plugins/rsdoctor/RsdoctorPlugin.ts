/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {PluginConfig} from '@docusaurus/types';

function createRsdoctorBundlerPlugin({isServer}: {isServer: boolean}) {
  // TODO Shitty workaround to bypass lib typechecking
  //  package does not work will with skipLibCheck false
  // // eslint-disable-next-line
  // const {RsdoctorWebpackMultiplePlugin} = require('@rsdoctor/webpack-plugin');
  // eslint-disable-next-line
  const {RsdoctorRspackMultiplePlugin} = require('@rsdoctor/rspack-plugin');

  // return new RsdoctorWebpackMultiplePlugin({
  return new RsdoctorRspackMultiplePlugin({
    name: isServer ? 'server' : 'client',
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
  const pluginClient = await createRsdoctorBundlerPlugin({isServer: false});
  const pluginServer = await createRsdoctorBundlerPlugin({isServer: true});
  console.log('Rsdoctor plugin enabled');
  return {
    name: 'rsdoctor-plugin',
    configureWebpack: (__config, isServer) => {
      const plugin = isServer ? pluginServer : pluginClient;
      return {
        plugins: [plugin],
      };
    },
  };
} satisfies PluginConfig);
