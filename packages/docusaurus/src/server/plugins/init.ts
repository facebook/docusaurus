/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import importFresh from 'import-fresh';
import type {
  DocusaurusPluginVersionInformation,
  ImportedPluginModule,
  LoadContext,
  PluginModule,
  PluginConfig,
  PluginOptions,
  InitializedPlugin,
} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';
import {getPluginVersion} from '../versions';
import {ensureUniquePluginInstanceIds} from './pluginIds';
import {
  normalizePluginOptions,
  normalizeThemeConfig,
} from '@docusaurus/utils-validation';

type NormalizedPluginConfig = {
  plugin: PluginModule;
  options: PluginOptions;
  // Only available when a string is provided in config
  pluginModule?: {
    path: string;
    module: ImportedPluginModule;
  };
};

function normalizePluginConfig(
  pluginConfig: PluginConfig,
  pluginRequire: NodeRequire,
): NormalizedPluginConfig {
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
    };
  }

  // plugins: [function plugin() { }]
  if (typeof pluginConfig === 'function') {
    return {
      plugin: pluginConfig,
      options: {},
    };
  }

  if (Array.isArray(pluginConfig)) {
    // plugins: [
    //   ['./plugin',options],
    // ]
    if (typeof pluginConfig[0] === 'string') {
      const pluginModuleImport = pluginConfig[0];
      const pluginPath = pluginRequire.resolve(pluginModuleImport);
      const pluginModule = importFresh<ImportedPluginModule>(pluginPath);
      return {
        plugin: pluginModule?.default ?? pluginModule,
        options: pluginConfig[1] ?? {},
        pluginModule: {
          path: pluginModuleImport,
          module: pluginModule,
        },
      };
    }
    // plugins: [
    //   [function plugin() { },options],
    // ]
    if (typeof pluginConfig[0] === 'function') {
      return {
        plugin: pluginConfig[0],
        options: pluginConfig[1] ?? {},
      };
    }
  }

  throw new Error(
    `Unexpected: can't load plugin for following plugin config.\n${JSON.stringify(
      pluginConfig,
    )}`,
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

export default async function initPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): Promise<InitializedPlugin[]> {
  // We need to resolve plugins from the perspective of the siteDir, since the
  // siteDir's package.json declares the dependency on these plugins.
  const pluginRequire = createRequire(context.siteConfigPath);

  function doGetPluginVersion(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): DocusaurusPluginVersionInformation {
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
  ) {
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
    pluginConfig: PluginConfig,
  ): Promise<InitializedPlugin> {
    const normalizedPluginConfig = normalizePluginConfig(
      pluginConfig,
      pluginRequire,
    );
    const pluginVersion: DocusaurusPluginVersionInformation =
      doGetPluginVersion(normalizedPluginConfig);
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
    };
  }

  const plugins: InitializedPlugin[] = (
    await Promise.all(
      pluginConfigs.map((pluginConfig) => {
        if (!pluginConfig) {
          return null;
        }
        return initializePlugin(pluginConfig);
      }),
    )
  ).filter(<T>(item: T): item is Exclude<T, null> => Boolean(item));

  ensureUniquePluginInstanceIds(plugins);

  return plugins;
}
