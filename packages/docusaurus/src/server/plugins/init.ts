/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import path from 'path';
import importFresh from 'import-fresh';
import type {
  PluginVersionInformation,
  ImportedPluginModule,
  LoadContext,
  PluginModule,
  PluginConfig,
  PluginOptions,
  InitializedPlugin,
} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import {getPluginVersion} from '../siteMetadata';
import {ensureUniquePluginInstanceIds} from './pluginIds';
import {
  normalizePluginOptions,
  normalizeThemeConfig,
} from '@docusaurus/utils-validation';
import {loadPluginConfigs} from './configs';

export type NormalizedPluginConfig = {
  plugin: PluginModule;
  options: PluginOptions;
  // Only available when a string is provided in config
  pluginModule?: {
    path: string;
    module: ImportedPluginModule;
  };
  /**
   * Different from pluginModule.path, this one is always an absolute path used
   * to resolve relative paths returned from lifecycles
   */
  entryPath: string;
};

async function normalizePluginConfig(
  pluginConfig: PluginConfig,
  configPath: string,
): Promise<NormalizedPluginConfig> {
  const pluginRequire = createRequire(configPath);
  // plugins: ['./plugin']
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

  // plugins: [function plugin() { }]
  if (typeof pluginConfig === 'function') {
    return {
      plugin: pluginConfig,
      options: {},
      entryPath: configPath,
    };
  }

  // plugins: [
  //   ['./plugin',options],
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
  //   [function plugin() { },options],
  // ]
  return {
    plugin: pluginConfig[0],
    options: pluginConfig[1],
    entryPath: configPath,
  };
}

export async function normalizePluginConfigs(
  pluginConfigs: PluginConfig[],
  configPath: string,
): Promise<NormalizedPluginConfig[]> {
  return Promise.all(
    pluginConfigs.map((pluginConfig) =>
      normalizePluginConfig(pluginConfig, configPath),
    ),
  );
}

function getOptionValidationFunction(
  normalizedPluginConfig: NormalizedPluginConfig,
): PluginModule['validateOptions'] {
  if (normalizedPluginConfig.pluginModule) {
    // support both commonjs and ES modules
    return (
      normalizedPluginConfig.pluginModule.module?.default?.validateOptions ??
      normalizedPluginConfig.pluginModule.module?.validateOptions
    );
  }
  return normalizedPluginConfig.plugin.validateOptions;
}

function getThemeValidationFunction(
  normalizedPluginConfig: NormalizedPluginConfig,
): PluginModule['validateThemeConfig'] {
  if (normalizedPluginConfig.pluginModule) {
    // support both commonjs and ES modules
    return (
      normalizedPluginConfig.pluginModule.module.default?.validateThemeConfig ??
      normalizedPluginConfig.pluginModule.module.validateThemeConfig
    );
  }
  return normalizedPluginConfig.plugin.validateThemeConfig;
}

export async function initPlugins(
  context: LoadContext,
): Promise<InitializedPlugin[]> {
  // We need to resolve plugins from the perspective of the siteDir, since the
  // siteDir's package.json declares the dependency on these plugins.
  const pluginRequire = createRequire(context.siteConfigPath);
  const pluginConfigs = await loadPluginConfigs(context);
  const pluginConfigsNormalized = await normalizePluginConfigs(
    pluginConfigs,
    context.siteConfigPath,
  );

  async function doGetPluginVersion(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): Promise<PluginVersionInformation> {
    // get plugin version
    if (normalizedPluginConfig.pluginModule?.path) {
      const pluginPath = pluginRequire.resolve(
        normalizedPluginConfig.pluginModule?.path,
      );
      return getPluginVersion(pluginPath, context.siteDir);
    }
    return {type: 'local'};
  }

  function doValidateThemeConfig(
    normalizedPluginConfig: NormalizedPluginConfig,
  ) {
    const validateThemeConfig = getThemeValidationFunction(
      normalizedPluginConfig,
    );
    if (validateThemeConfig) {
      return validateThemeConfig({
        validate: normalizeThemeConfig,
        themeConfig: context.siteConfig.themeConfig,
      });
    }
    return context.siteConfig.themeConfig;
  }

  function doValidatePluginOptions(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): Required<PluginOptions> {
    const validateOptions = getOptionValidationFunction(normalizedPluginConfig);
    if (validateOptions) {
      return validateOptions({
        validate: normalizePluginOptions,
        options: normalizedPluginConfig.options,
      });
    }
    // Important to ensure all plugins have an id
    // as we don't go through the Joi schema that adds it
    return {
      ...normalizedPluginConfig.options,
      id: normalizedPluginConfig.options.id ?? DEFAULT_PLUGIN_ID,
    };
  }

  async function initializePlugin(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): Promise<InitializedPlugin> {
    const pluginVersion: PluginVersionInformation = await doGetPluginVersion(
      normalizedPluginConfig,
    );
    const pluginOptions = doValidatePluginOptions(normalizedPluginConfig);

    // Side-effect: merge the normalized theme config in the original one
    context.siteConfig.themeConfig = {
      ...context.siteConfig.themeConfig,
      ...doValidateThemeConfig(normalizedPluginConfig),
    };

    const pluginInstance = await normalizedPluginConfig.plugin(
      context,
      pluginOptions,
    );

    return {
      ...pluginInstance,
      options: pluginOptions,
      version: pluginVersion,
      path: path.dirname(normalizedPluginConfig.entryPath),
    };
  }

  const plugins: InitializedPlugin[] = await Promise.all(
    pluginConfigsNormalized.map(initializePlugin),
  );

  ensureUniquePluginInstanceIds(plugins);

  return plugins;
}
