/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loadContext} from '../../server';
import {initPlugins, normalizePluginConfigs} from '../../server/plugins/init';
import {loadPluginConfigs} from '../../server/plugins/configs';
import type {SwizzleContext} from './common';

export async function initSwizzleContext(
  siteDir: string,
): Promise<SwizzleContext> {
  const context = await loadContext(siteDir);
  const plugins = await initPlugins(context);
  const pluginConfigs = await loadPluginConfigs(context);

  const pluginsNormalized = await normalizePluginConfigs(
    pluginConfigs,
    context.siteConfigPath,
  );

  return {
    plugins: plugins.map((plugin, pluginIndex) => ({
      plugin: pluginsNormalized[pluginIndex]!,
      instance: plugin,
    })),
  };
}
