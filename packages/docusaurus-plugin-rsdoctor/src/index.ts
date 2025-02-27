/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RsdoctorRspackMultiplePlugin} from '@rsdoctor/rspack-plugin';
import {RsdoctorWebpackMultiplePlugin} from '@rsdoctor/webpack-plugin';
import type {CurrentBundler, LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

function createRsdoctorBundlerPlugin({
  isServer,
  currentBundler,
  options,
}: {
  isServer: boolean;
  currentBundler: CurrentBundler;
  options: PluginOptions;
}) {
  const RsdoctorPlugin =
    currentBundler.name === 'rspack'
      ? RsdoctorRspackMultiplePlugin
      : RsdoctorWebpackMultiplePlugin;

  return new RsdoctorPlugin({
    name: isServer ? 'server' : 'client',
    ...options.rsdoctorOptions,
  });
}

export default (async function pluginRsdoctor(
  context: LoadContext,
  options: PluginOptions,
): Promise<Plugin | null> {
  return {
    name: 'docusaurus-plugin-rsdoctor',
    configureWebpack: (__config, isServer) => {
      return {
        plugins: [
          createRsdoctorBundlerPlugin({
            isServer,
            currentBundler: context.currentBundler,
            options,
          }),
        ],
      };
    },
  };
});

export {validateOptions} from './options';

export type {PluginOptions, Options};
