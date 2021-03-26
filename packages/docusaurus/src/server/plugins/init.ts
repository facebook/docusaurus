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
      let pluginModuleImport: string | undefined;
      let pluginOptions: PluginOptions = {};

      if (!pluginItem) {
        return null;
      }

      if (typeof pluginItem === 'string') {
        pluginModuleImport = pluginItem;
      } else if (Array.isArray(pluginItem)) {
        [pluginModuleImport, pluginOptions = {}] = pluginItem;
      } else {
        throw new TypeError(`You supplied a wrong type of plugin.
A plugin should be either string or [importPath: string, options?: object].

For more information, visit https://docusaurus.io/docs/using-plugins.`);
      }

      if (!pluginModuleImport) {
        throw new Error('The path to the plugin is either undefined or null.');
      }

      // The pluginModuleImport value is any valid
      // module identifier - npm package or locally-resolved path.
      const pluginPath = pluginRequire.resolve(pluginModuleImport);
      const pluginModule: ImportedPluginModule = importFresh(pluginPath);
      const pluginVersion = getPluginVersion(pluginPath, context.siteDir);

      const plugin = pluginModule.default || pluginModule;

      // support both commonjs and ES modules
      const validateOptions =
        pluginModule.default?.validateOptions ?? pluginModule.validateOptions;

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

      // support both commonjs and ES modules
      const validateThemeConfig =
        pluginModule.default?.validateThemeConfig ??
        pluginModule.validateThemeConfig;

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
