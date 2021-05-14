/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Module from 'module';
import importFresh from 'import-fresh';
import {
  DocusaurusPluginVersionInformation,
  ImportedPluginModule,
  LoadContext,
  PluginModule,
  Plugin,
  PluginConfig,
  PluginOptions,
} from '@docusaurus/types';
import {DEFAULT_PLUGIN_ID} from '../../constants';
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
    `Unexpected: cant load plugin for plugin config = ${JSON.stringify(
      pluginConfig,
    )}`,
  );
}

export type InitPlugin = Plugin<unknown> & {
  readonly options: PluginOptions;
  readonly version: DocusaurusPluginVersionInformation;
};

export default function initPlugins({
  pluginConfigs,
  context,
}: {
  pluginConfigs: PluginConfig[];
  context: LoadContext;
}): InitPlugin[] {
  // We need to resolve plugins from the perspective of the siteDir, since the siteDir's package.json
  // declares the dependency on these plugins.
  // We need to fallback to createRequireFromPath since createRequire is only available in node v12.
  // See: https://nodejs.org/api/modules.html#modules_module_createrequire_filename
  const createRequire = Module.createRequire || Module.createRequireFromPath;
  const pluginRequire = createRequire(context.siteConfigPath);

  function doGetPluginVersion(
    pluginModuleImport: string | undefined,
  ): DocusaurusPluginVersionInformation {
    // get plugin version
    if (pluginModuleImport) {
      const pluginPath = pluginRequire.resolve(pluginModuleImport);
      return getPluginVersion(pluginPath, context.siteDir);
    } else {
      return {type: 'local'};
    }
  }

  const plugins: InitPlugin[] = pluginConfigs
    .map((pluginConfig) => {
      let pluginOptions: PluginOptions = {};
      let validateOptions;

      if (!pluginConfig) {
        return null;
      }

      const normalizedPluginConfig = normalizePluginConfig(
        pluginConfig,
        pluginRequire,
      );

      // TODO not proud of this legacy code, need more refactors!
      pluginOptions = normalizedPluginConfig.options;
      const {plugin} = normalizedPluginConfig;
      const pluginModuleImport = normalizedPluginConfig.pluginModule?.path;
      const pluginModule = normalizedPluginConfig.pluginModule?.module;

      const pluginVersion: DocusaurusPluginVersionInformation = doGetPluginVersion(
        pluginModuleImport,
      );

      if (pluginModuleImport) {
        // support both commonjs and ES modules
        validateOptions =
          pluginModule?.default?.validateOptions ??
          pluginModule?.validateOptions;

        // pluginItem is a function
      } else {
        validateOptions = plugin?.validateOptions;
      }

      if (validateOptions) {
        pluginOptions = validateOptions({
          validate: normalizePluginOptions,
          options: pluginOptions,
        });
      } else {
        // Important to ensure all plugins have an id
        // as we don't go through the Joi schema that adds it
        pluginOptions = {
          ...pluginOptions,
          id: pluginOptions.id ?? DEFAULT_PLUGIN_ID,
        };
      }

      // support both commonjs and ES modules and Functional plugins
      let validateThemeConfig;
      if (pluginModule) {
        validateThemeConfig =
          pluginModule.default?.validateThemeConfig ??
          pluginModule.validateThemeConfig;
      } else {
        validateThemeConfig = plugin?.validateOptions;
      }

      if (validateThemeConfig) {
        const normalizedThemeConfig = validateThemeConfig({
          validate: normalizeThemeConfig,
          themeConfig: context.siteConfig.themeConfig,
        });

        context.siteConfig.themeConfig = {
          ...context.siteConfig.themeConfig,
          ...normalizedThemeConfig,
        };
      }

      return {
        ...plugin(context, pluginOptions),
        options: pluginOptions,
        version: pluginVersion,
      };
    })
    .filter(<T>(item: T): item is Exclude<T, null> => Boolean(item));

  ensureUniquePluginInstanceIds(plugins);

  return plugins;
}
