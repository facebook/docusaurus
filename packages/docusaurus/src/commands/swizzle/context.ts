/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loadContext} from '../../server';
import {initPlugins} from '../../server/plugins/init';
import {loadPluginConfigs} from '../../server/plugins/configs';
import type {SwizzleCLIOptions, SwizzleContext} from './common';

export async function initSwizzleContext(
  siteDir: string,
  options: SwizzleCLIOptions,
): Promise<SwizzleContext> {
  const context = await loadContext({siteDir, config: options.config});
  const plugins = await initPlugins(context);
  const pluginConfigs = await loadPluginConfigs(context);

  return {
    plugins: plugins.map((plugin, pluginIndex) => ({
      plugin: pluginConfigs[pluginIndex]!,
      instance: plugin,
    })),
  };
}
