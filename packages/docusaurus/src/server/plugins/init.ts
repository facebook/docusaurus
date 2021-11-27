/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import {
  DocusaurusPluginVersionInformation,
  ImportedPluginModule,
  LoadContext,
  PluginModule,
  PluginConfig,
  PluginOptions,
  InitializedPlugin,
  PluginConfigs,
} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID} from '../../constants';
import {getPluginVersion} from '../versions';
import loadModule from '../loadModule';
import {ensureUniquePluginInstanceIds} from './pluginIds';
import {
  normalizePluginOptions,
  normalizeThemeConfig,
} from '@docusaurus/utils-validation';

type NormalizedPluginConfig = {
  resolvedPath?: string;
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
  pluginType: 'plugin' | 'theme',
): NormalizedPluginConfig {
  if (typeof pluginConfig === 'string') {
    const pluginModule = loadModule<ImportedPluginModule>(
      pluginConfig,
      pluginRequire,
      pluginType,
    );
    return {
      resolvedPath: pluginModule.path,
      plugin: pluginModule.module.default ?? pluginModule.module,
      options: {},
      pluginModule: {
        path: pluginConfig,
        module: pluginModule.module,
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
      const pluginModule = loadModule<ImportedPluginModule>(
        pluginConfig[0],
        pluginRequire,
        pluginType,
      );
      return {
        resolvedPath: pluginModule.path,
        plugin: pluginModule.module.default ?? pluginModule.module,
        options: pluginConfig[1] ?? {},
        pluginModule: {
          path: pluginConfig[0],
          module: pluginModule.module,
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
  } else {
    return normalizedPluginConfig.plugin.validateOptions;
  }
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
  } else {
    return normalizedPluginConfig.plugin.validateThemeConfig;
  }
}

export default function initPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfigs;
  context: LoadContext;
}): InitializedPlugin[] {
  // We need to resolve plugins from the perspective of the siteDir, since the siteDir's package.json
  // declares the dependency on these plugins.
  const pluginRequire = createRequire(context.siteConfigPath);

  function doGetPluginVersion(
    normalizedPluginConfig: NormalizedPluginConfig,
  ): DocusaurusPluginVersionInformation {
    // get plugin version
    if (normalizedPluginConfig.resolvedPath) {
      return getPluginVersion(
        normalizedPluginConfig.resolvedPath,
        context.siteDir,
      );
    } else {
      return {type: 'local'};
    }
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
    } else {
      return context.siteConfig.themeConfig;
    }
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
    } else {
      // Important to ensure all plugins have an id
      // as we don't go through the Joi schema that adds it
      return {
        ...normalizedPluginConfig.options,
        id: normalizedPluginConfig.options.id ?? DEFAULT_PLUGIN_ID,
      };
    }
  }

  const pluginTypes = ['theme', 'plugin'] as const;

  const plugins: InitializedPlugin[] = pluginTypes
    .flatMap((pluginType) =>
      pluginConfigs[pluginType].map((pluginConfig) => {
        if (!pluginConfig) {
          return null;
        }
        const normalizedPluginConfig = normalizePluginConfig(
          pluginConfig,
          pluginRequire,
          pluginType,
        );
        const pluginVersion: DocusaurusPluginVersionInformation =
          doGetPluginVersion(normalizedPluginConfig);
        const pluginOptions = doValidatePluginOptions(normalizedPluginConfig);

        // Side-effect: merge the normalized theme config in the original one
        context.siteConfig.themeConfig = {
          ...context.siteConfig.themeConfig,
          ...doValidateThemeConfig(normalizedPluginConfig),
        };

        const pluginInstance = normalizedPluginConfig.plugin(
          context,
          pluginOptions,
        );

        return {
          ...pluginInstance,
          options: pluginOptions,
          version: pluginVersion,
        };
      }),
    )
    .filter(<T>(item: T): item is Exclude<T, null> => Boolean(item));

  ensureUniquePluginInstanceIds(plugins);

  return plugins;
}
