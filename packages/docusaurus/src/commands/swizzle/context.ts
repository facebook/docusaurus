/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import {loadContext, loadPluginConfigs} from '../../server';
import initPlugins, {normalizePluginConfigs} from '../../server/plugins/init';
import type {InitializedPlugin} from '@docusaurus/types';
import type {SwizzleContext} from './common';

export async function initSwizzleContext(
  siteDir: string,
): Promise<SwizzleContext> {
  const context = await loadContext(siteDir);
  const pluginRequire = createRequire(context.siteConfigPath);

  const pluginConfigs = await loadPluginConfigs(context);
  const plugins: InitializedPlugin[] = await initPlugins({
    pluginConfigs,
    context,
  });

  const pluginsNormalized = await normalizePluginConfigs(
    pluginConfigs,
    pluginRequire,
  );

  return {
    plugins: plugins.map((plugin, pluginIndex) => ({
      plugin: pluginsNormalized[pluginIndex],
      instance: plugin,
    })),
  };
}
