/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {RsdoctorRspackMultiplePlugin} from '@rsdoctor/rspack-plugin';
import {RsdoctorWebpackMultiplePlugin} from '@rsdoctor/webpack-plugin';
import type {ConfigureWebpackResult} from '@docusaurus/types/src/plugin';
import type {CurrentBundler, LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';

type RsdoctorPluginType = typeof RsdoctorRspackMultiplePlugin;

function getRsdoctorPlugin(
  currentBundlerName: CurrentBundler['name'],
): RsdoctorPluginType {
  return currentBundlerName === 'rspack'
    ? RsdoctorRspackMultiplePlugin
    : // Cast fixes "error TS2321: Excessive stack depth"
      // This may be a temporary TS 7.0 issue?
      (RsdoctorWebpackMultiplePlugin as unknown as RsdoctorPluginType);
}

function createRsdoctorBundlerPlugin({
  isServer,
  currentBundler,
  options,
}: {
  isServer: boolean;
  currentBundler: CurrentBundler;
  options: PluginOptions;
}) {
  const RsdoctorPlugin = getRsdoctorPlugin(currentBundler.name);

  // Little type incompatibility?
  type WebpackPlugin = NonNullable<ConfigureWebpackResult['plugins']>[number];

  return new RsdoctorPlugin({
    name: isServer ? 'server' : 'client',
    ...options.rsdoctorOptions,
  }) as unknown as WebpackPlugin;
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
