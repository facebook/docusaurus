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

  const plugins: InitPlugin[] = pluginConfigs
    .map((pluginItem) => {
      // let pluginModuleImport: string | undefined;
      let pluginOptions: PluginOptions = {};
      // let plugin: PluginModule | undefined;
      let validateOptions;
      // let pluginModule: ImportedPluginModule | undefined;
      let pluginVersion: DocusaurusPluginVersionInformation;

      if (!pluginItem) {
        return null;
      }

      function getPlugin(): PluginModule | null {
        if (Array.isArray(pluginItem)) {
          if (typeof pluginItem[0] === 'string') {
            const pluginModuleImport = pluginItem[0];
            const pluginPath = pluginRequire.resolve(pluginModuleImport);
            const pluginModule = importFresh<ImportedPluginModule>(pluginPath);
            return pluginModule?.default || pluginModule;
          } else if (typeof pluginItem[0] === 'function') {
            return pluginItem[0];
          }
        } else if (typeof pluginItem === 'string') {
          const pluginModuleImport = pluginItem;
          const pluginPath = pluginRequire.resolve(pluginModuleImport);
          const pluginModule = importFresh<ImportedPluginModule>(pluginPath);
          return pluginModule?.default || pluginModule;
        } else if (typeof pluginItem === 'function') {
          return pluginItem;
        }

        return null;
      }

      function getPluginModuleImport(): string | null {
        if (typeof pluginItem === 'string') {
          return pluginItem;
        } else if (
          Array.isArray(pluginItem) &&
          typeof pluginItem[0] === 'string'
        ) {
          return pluginItem[0];
        }

        return null;
      }

      function getPluginModule() {
        if (typeof pluginItem === 'string') {
          const pluginModuleImport = pluginItem;
          const pluginPath = pluginRequire.resolve(pluginModuleImport);
          const pluginModule = importFresh<ImportedPluginModule>(pluginPath);
          return pluginModule;
          // [path : string, options : {}]
        } else if (
          Array.isArray(pluginItem) &&
          typeof pluginItem[0] === 'string'
        ) {
          const pluginModuleImport = pluginItem[0];
          const pluginPath = pluginRequire.resolve(pluginModuleImport);
          const pluginModule = importFresh<ImportedPluginModule>(pluginPath);
          return pluginModule;
        }

        return null;
      }

      function getPluginOptions() {
        // [path : string, options : {}]
        if (Array.isArray(pluginItem) && pluginItem[1]) {
          return pluginItem[1];
        }

        return {};
      }

      if (
        typeof pluginItem === 'string' ||
        (Array.isArray(pluginItem) && typeof pluginItem[0] === 'string') ||
        typeof pluginItem === 'function' ||
        (Array.isArray(pluginItem) && typeof pluginItem[0] === 'function')
      ) {
      } else {
        throw new TypeError(`You supplied a wrong type of plugin.
A plugin should be either string, function or [importPath: string : function, options?: object].

For more information, visit https://docusaurus.io/docs/using-plugins.`);
      }

      const pluginModuleImport = getPluginModuleImport();
      const plugin = getPlugin();
      pluginOptions = getPluginOptions();
      const pluginModule = getPluginModule();

      if (!plugin) {
        throw new Error('The path to the plugin is either undefined or null.');
      }

      // get plugin version
      if (pluginModuleImport) {
        const pluginPath = pluginRequire.resolve(pluginModuleImport);
        pluginVersion = getPluginVersion(pluginPath, context.siteDir);
      } else {
        pluginVersion = {type: 'local'};
      }

      if (pluginModuleImport) {
        // support both commonjs and ES modules
        validateOptions =
          pluginModule?.default?.validateOptions ??
          pluginModule?.validateOptions;

        // pluginItem is a function
      } else {
        validateOptions = plugin?.validateOptions;
        pluginVersion = {type: 'local'};
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
