/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import {loadPresets} from './presets';
import {resolveModuleName} from '../moduleShorthand';
import type {LoadContext, PluginConfig} from '@docusaurus/types';

export async function loadPluginConfigs(
  context: LoadContext,
): Promise<PluginConfig[]> {
  const preset = await loadPresets(context);
  const {siteConfig, siteConfigPath} = context;
  const require = createRequire(siteConfigPath);
  function normalizeShorthand(
    pluginConfig: PluginConfig,
    pluginType: 'plugin' | 'theme',
  ): PluginConfig {
    if (typeof pluginConfig === 'string') {
      return resolveModuleName(pluginConfig, require, pluginType);
    } else if (
      Array.isArray(pluginConfig) &&
      typeof pluginConfig[0] === 'string'
    ) {
      return [
        resolveModuleName(pluginConfig[0], require, pluginType),
        pluginConfig[1] ?? {},
      ];
    }
    return pluginConfig;
  }
  preset.plugins = preset.plugins.map((plugin) =>
    normalizeShorthand(plugin, 'plugin'),
  );
  preset.themes = preset.themes.map((theme) =>
    normalizeShorthand(theme, 'theme'),
  );
  const standalonePlugins = siteConfig.plugins.map((plugin) =>
    normalizeShorthand(plugin, 'plugin'),
  );
  const standaloneThemes = siteConfig.themes.map((theme) =>
    normalizeShorthand(theme, 'theme'),
  );
  return [
    ...preset.plugins,
    ...preset.themes,
    // Site config should be the highest priority.
    ...standalonePlugins,
    ...standaloneThemes,
  ];
}
