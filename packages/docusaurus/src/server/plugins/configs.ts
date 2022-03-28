/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import importFresh from 'import-fresh';
import {loadPresets} from './presets';
import {resolveModuleName} from './moduleShorthand';
import type {
  LoadContext,
  PluginConfig,
  ImportedPluginModule,
  NormalizedPluginConfig,
} from '@docusaurus/types';

async function normalizePluginConfig(
  pluginConfig: PluginConfig,
  configPath: string,
  pluginRequire: NodeRequire,
): Promise<NormalizedPluginConfig> {
  // plugins: ["./plugin"]
  if (typeof pluginConfig === 'string') {
    const pluginModuleImport = pluginConfig;
    const pluginPath = pluginRequire.resolve(pluginModuleImport);
    const pluginModule = importFresh<ImportedPluginModule>(pluginPath);
    return {
      plugin: pluginModule?.default ?? pluginModule,
      options: {},
      pluginModule: {
        path: pluginModuleImport,
        module: pluginModule,
      },
      entryPath: pluginPath,
    };
  }

  // plugins: [() => {...}]
  if (typeof pluginConfig === 'function') {
    return {
      plugin: pluginConfig,
      options: {},
      entryPath: configPath,
    };
  }

  // plugins: [
  //   ["./plugin",options],
  // ]
  if (typeof pluginConfig[0] === 'string') {
    const pluginModuleImport = pluginConfig[0];
    const pluginPath = pluginRequire.resolve(pluginModuleImport);
    const pluginModule = importFresh<ImportedPluginModule>(pluginPath);
    return {
      plugin: pluginModule?.default ?? pluginModule,
      options: pluginConfig[1],
      pluginModule: {
        path: pluginModuleImport,
        module: pluginModule,
      },
      entryPath: pluginPath,
    };
  }
  // plugins: [
  //   [() => {...}, options],
  // ]
  return {
    plugin: pluginConfig[0],
    options: pluginConfig[1],
    entryPath: configPath,
  };
}

/**
 * Reads the site config's `presets`, `themes`, and `plugins`, imports them, and
 * normalizes the return value. Plugin configs are ordered, mostly for theme
 * alias shadowing. Site themes have the highest priority, and preset plugins
 * are the lowest.
 */
export async function loadPluginConfigs(
  context: LoadContext,
): Promise<NormalizedPluginConfig[]> {
  const preset = await loadPresets(context);
  const {siteConfig, siteConfigPath} = context;
  const pluginRequire = createRequire(siteConfigPath);
  function normalizeShorthand(
    pluginConfig: PluginConfig,
    pluginType: 'plugin' | 'theme',
  ): PluginConfig {
    if (typeof pluginConfig === 'string') {
      return resolveModuleName(pluginConfig, pluginRequire, pluginType);
    } else if (
      Array.isArray(pluginConfig) &&
      typeof pluginConfig[0] === 'string'
    ) {
      return [
        resolveModuleName(pluginConfig[0], pluginRequire, pluginType),
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
  const pluginConfigs = [
    ...preset.plugins,
    ...preset.themes,
    // Site config should be the highest priority.
    ...standalonePlugins,
    ...standaloneThemes,
  ];
  return Promise.all(
    pluginConfigs.map((pluginConfig) =>
      normalizePluginConfig(
        pluginConfig,
        context.siteConfigPath,
        pluginRequire,
      ),
    ),
  );
}
